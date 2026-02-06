<?php

namespace App\Service\Scoring;

use App\Entity\Offer;
use App\Entity\TravelGroup;

/**
 * Rule-based scoring service (Stage 1)
 * Simple, deterministic scoring based on business rules
 */
class RuleBasedScoringService implements ScoringServiceInterface
{
    public function score(Offer $offer, TravelGroup $group): array
    {
        $score = 0;
        $reasons = [];
        $breakdown = [];

        // Base score (everyone starts at 20)
        $score += 20;
        $breakdown['base'] = 20;

        // Children age matching
        $childrenScores = $this->scoreChildrenFeatures($offer, $group);
        $score += $childrenScores['score'];
        $reasons = array_merge($reasons, $childrenScores['reasons']);
        $breakdown['children'] = $childrenScores['score'];

        // Board type matching
        $boardScores = $this->scoreBoardType($offer, $group);
        $score += $boardScores['score'];
        $reasons = array_merge($reasons, $boardScores['reasons']);
        $breakdown['board_type'] = $boardScores['score'];

        // Transfer and flight preferences
        $transferScores = $this->scoreTransfer($offer, $group);
        $score += $transferScores['score'];
        $reasons = array_merge($reasons, $transferScores['reasons']);
        $breakdown['transfer'] = $transferScores['score'];

        // Room type matching
        $roomScores = $this->scoreRoomType($offer, $group);
        $score += $roomScores['score'];
        $reasons = array_merge($reasons, $roomScores['reasons']);
        $breakdown['room_type'] = $roomScores['score'];

        // AI instructions keyword matching
        $aiScores = $this->scoreAIInstructions($offer, $group);
        $score += $aiScores['score'];
        $reasons = array_merge($reasons, $aiScores['reasons']);
        $breakdown['ai_keywords'] = $aiScores['score'];

        // Price scoring (lower is better)
        $priceScores = $this->scorePricing($offer, $group);
        $score += $priceScores['score'];
        $reasons = array_merge($reasons, $priceScores['reasons']);
        $breakdown['price'] = $priceScores['score'];

        // Cap at 100
        $score = min(100, $score);

        return [
            'score' => $score,
            'reasoning' => $this->formatReasoning($reasons),
            'breakdown' => $breakdown,
            'reasons' => $reasons,
        ];
    }

    public function scoreMany(array $offers, TravelGroup $group): array
    {
        $scored = [];

        foreach ($offers as $offer) {
            $result = $this->score($offer, $group);
            $scored[] = [
                'offer' => $offer,
                'score' => $result['score'],
                'reasoning' => $result['reasoning'],
                'breakdown' => $result['breakdown'],
            ];
        }

        // Sort by score descending
        usort($scored, fn($a, $b) => $b['score'] - $a['score']);

        return $scored;
    }

    public function getName(): string
    {
        return 'rule-based-v1';
    }

    private function scoreChildrenFeatures(Offer $offer, TravelGroup $group): array
    {
        $score = 0;
        $reasons = [];

        $children = array_filter($group->getPeople(), fn($p) => $p['type'] === 'child');

        if (empty($children)) {
            return ['score' => 0, 'reasons' => []];
        }

        $childrenAges = array_map(fn($child) => $this->calculateAge($child['birthDate']), $children);

        // Young children (0-12) + keywords suggesting family features
        $hasYoungChildren = !empty(array_filter($childrenAges, fn($age) => $age <= 12));

        if ($hasYoungChildren) {
            $hotelName = strtolower($offer->getHotel()->getName());
            $city = strtolower($offer->getHotel()->getCity());

            // Check for family-friendly keywords
            $familyKeywords = ['aqua', 'park', 'family', 'kids', 'children', 'club'];
            foreach ($familyKeywords as $keyword) {
                if (str_contains($hotelName, $keyword)) {
                    $score += 15;
                    $reasons[] = "Hotel idealny dla rodzin z dziećmi";
                    break;
                }
            }

            // Room type matches family size
            $totalPeople = count($group->getPeople());
            $roomType = strtolower($offer->getRoomType());

            if ($totalPeople >= 4 && str_contains($roomType, 'family')) {
                $score += 10;
                $reasons[] = "Pokój rodzinny dla {$totalPeople} osób";
            }
        }

        return ['score' => $score, 'reasons' => $reasons];
    }

    private function scoreBoardType(Offer $offer, TravelGroup $group): array
    {
        $score = 0;
        $reasons = [];

        $hasChildren = !empty(array_filter($group->getPeople(), fn($p) => $p['type'] === 'child'));

        // All Inclusive is great for families with children
        if ($hasChildren && $offer->getBoardType() === 'All Inclusive') {
            $score += 15;
            $reasons[] = "All Inclusive - wygodne dla rodzin";
        }

        // Check AI instructions for board type preferences
        $aiInstructions = strtolower($group->getAiInstructions() ?? '');

        if (str_contains($aiInstructions, 'all inclusive') && $offer->getBoardType() === 'All Inclusive') {
            $score += 10;
            $reasons[] = "Wybrany przez Ciebie typ wyżywienia";
        }

        return ['score' => $score, 'reasons' => $reasons];
    }

    private function scoreTransfer(Offer $offer, TravelGroup $group): array
    {
        $score = 0;
        $reasons = [];

        $aiInstructions = strtolower($group->getAiInstructions() ?? '');
        $flightInfo = $offer->getFlightInfo();

        // Short transfer preference
        if (str_contains($aiInstructions, 'krótki transfer') ||
            str_contains($aiInstructions, 'blisko lotniska')) {

            $transferDuration = (int) filter_var($flightInfo['transferDuration'] ?? '60', FILTER_SANITIZE_NUMBER_INT);

            if ($transferDuration < 30) {
                $score += 15;
                $reasons[] = "Bardzo krótki transfer ({$transferDuration} min)";
            } elseif ($transferDuration < 60) {
                $score += 10;
                $reasons[] = "Krótki transfer ({$transferDuration} min)";
            }
        }

        // Transfer included bonus
        if ($flightInfo['transferIncluded'] ?? false) {
            $score += 5;
            $reasons[] = "Transfer wliczony w cenę";
        }

        // Morning flight preference check
        if (str_contains($aiInstructions, 'nie lubi latać rano') ||
            str_contains($aiInstructions, 'późny lot')) {

            $departureTime = $flightInfo['outbound']['departure'] ?? '12:00';
            $hour = (int) substr($departureTime, 0, 2);

            if ($hour >= 10) {
                $score += 8;
                $reasons[] = "Wylot po 10:00 - bez wczesnego wstawania";
            }
        }

        return ['score' => $score, 'reasons' => $reasons];
    }

    private function scoreRoomType(Offer $offer, TravelGroup $group): array
    {
        $score = 0;
        $reasons = [];

        $totalPeople = count($group->getPeople());
        $roomType = $offer->getRoomType();

        // Extract room capacity (e.g., "Standard 2+2" -> 4)
        preg_match('/(\d+)\+(\d+)/', $roomType, $matches);
        $roomCapacity = !empty($matches) ? (int)$matches[1] + (int)$matches[2] : 4;

        // Perfect match
        if ($roomCapacity === $totalPeople) {
            $score += 10;
            $reasons[] = "Idealny rozmiar pokoju ({$totalPeople} osoby)";
        } elseif ($roomCapacity >= $totalPeople && $roomCapacity <= $totalPeople + 1) {
            $score += 5;
            $reasons[] = "Odpowiedni pokój dla grupy";
        }

        return ['score' => $score, 'reasons' => $reasons];
    }

    private function scoreAIInstructions(Offer $offer, TravelGroup $group): array
    {
        $score = 0;
        $reasons = [];

        $aiInstructions = strtolower($group->getAiInstructions() ?? '');

        if (empty($aiInstructions)) {
            return ['score' => 0, 'reasons' => []];
        }

        $hotelName = strtolower($offer->getHotel()->getName());
        $city = strtolower($offer->getHotel()->getCity());

        // Amenity keywords
        $amenityKeywords = [
            'basen' => ['pool', 'aqua', 'basen'],
            'plaża' => ['beach', 'plaża', 'sea'],
            'spa' => ['spa', 'wellness', 'relaks'],
            'aquapark' => ['aqua', 'park', 'waterpark'],
            'animacje' => ['animation', 'club', 'kids'],
        ];

        foreach ($amenityKeywords as $polish => $keywords) {
            if (str_contains($aiInstructions, $polish)) {
                foreach ($keywords as $keyword) {
                    if (str_contains($hotelName, $keyword)) {
                        $score += 8;
                        $reasons[] = ucfirst($polish) . " w hotelu";
                        break 2;
                    }
                }
            }
        }

        // Destination matching
        if (str_contains($aiInstructions, 'grecja') && str_contains($city, 'hersonissos')) {
            $score += 5;
            $reasons[] = "Grecja - wybrana destynacja";
        }

        return ['score' => $score, 'reasons' => $reasons];
    }

    private function scorePricing(Offer $offer, TravelGroup $group): array
    {
        $score = 0;
        $reasons = [];

        $price = (float) $offer->getPrice();
        $totalPeople = count($group->getPeople());

        // Avoid division by zero
        if ($totalPeople === 0) {
            $totalPeople = 2; // default to 2 people if group is empty
        }

        $pricePerPerson = $offer->isPricePerPerson();

        $totalPrice = $pricePerPerson ? $price * $totalPeople : $price;
        $pricePerPersonCalculated = $totalPrice / $totalPeople;

        // Price tiers
        if ($pricePerPersonCalculated < 2500) {
            $score += 10;
            $reasons[] = "Bardzo atrakcyjna cena";
        } elseif ($pricePerPersonCalculated < 3500) {
            $score += 7;
            $reasons[] = "Dobra cena";
        } elseif ($pricePerPersonCalculated < 4500) {
            $score += 3;
        }

        // Check against AI instructions budget
        $aiInstructions = strtolower($group->getAiInstructions() ?? '');

        if (preg_match('/do (\d+)/', $aiInstructions, $matches)) {
            $budget = (int) $matches[1];

            if ($pricePerPersonCalculated <= $budget) {
                $score += 5;
                $reasons[] = "W budżecie (do {$budget} zł)";
            }
        }

        return ['score' => $score, 'reasons' => $reasons];
    }

    private function calculateAge(string $birthDate): int
    {
        $birth = new \DateTime($birthDate);
        $now = new \DateTime();
        return $now->diff($birth)->y;
    }

    private function formatReasoning(array $reasons): string
    {
        if (empty($reasons)) {
            return 'Standardowa oferta';
        }

        // Take top 3 reasons
        $topReasons = array_slice($reasons, 0, 3);

        return implode(' • ', $topReasons);
    }
}
