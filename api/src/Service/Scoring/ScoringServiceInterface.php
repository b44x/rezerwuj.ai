<?php

namespace App\Service\Scoring;

use App\Entity\Offer;
use App\Entity\TravelGroup;

/**
 * Interface for offer scoring services
 * Allows easy switching between rule-based, AI, and ML implementations
 */
interface ScoringServiceInterface
{
    /**
     * Score an offer for a travel group
     *
     * @param Offer $offer The vacation package offer
     * @param TravelGroup $group The user's travel group with preferences
     * @return array ['score' => int (0-100), 'reasoning' => string, 'breakdown' => array]
     */
    public function score(Offer $offer, TravelGroup $group): array;

    /**
     * Score multiple offers and return sorted by score (highest first)
     *
     * @param Offer[] $offers
     * @param TravelGroup $group
     * @return array Array of ['offer' => Offer, 'score' => int, 'reasoning' => string]
     */
    public function scoreMany(array $offers, TravelGroup $group): array;

    /**
     * Get the name/version of this scoring implementation
     */
    public function getName(): string;
}
