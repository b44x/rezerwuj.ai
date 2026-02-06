<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260206141139 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE offer (id UUID NOT NULL, price NUMERIC(10, 2) NOT NULL, price_per_person BOOLEAN NOT NULL, departure_city VARCHAR(100) NOT NULL, departure_date DATE NOT NULL, return_date DATE NOT NULL, duration_days INT NOT NULL, board_type VARCHAR(50) NOT NULL, room_type VARCHAR(100) NOT NULL, flight_info JSON NOT NULL, external_url TEXT NOT NULL, is_active BOOLEAN NOT NULL, last_checked_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, hotel_id INT NOT NULL, provider_id UUID NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE INDEX IDX_29D6873E3243BB18 ON offer (hotel_id)');
        $this->addSql('CREATE INDEX IDX_29D6873EA53A8AA ON offer (provider_id)');
        $this->addSql('CREATE TABLE provider (id UUID NOT NULL, name VARCHAR(100) NOT NULL, logo_url VARCHAR(255) DEFAULT NULL, website VARCHAR(255) DEFAULT NULL, commission_percent DOUBLE PRECISION DEFAULT NULL, is_active BOOLEAN NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY (id))');
        $this->addSql('ALTER TABLE offer ADD CONSTRAINT FK_29D6873E3243BB18 FOREIGN KEY (hotel_id) REFERENCES hotel (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE offer ADD CONSTRAINT FK_29D6873EA53A8AA FOREIGN KEY (provider_id) REFERENCES provider (id) NOT DEFERRABLE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE offer DROP CONSTRAINT FK_29D6873E3243BB18');
        $this->addSql('ALTER TABLE offer DROP CONSTRAINT FK_29D6873EA53A8AA');
        $this->addSql('DROP TABLE offer');
        $this->addSql('DROP TABLE provider');
    }
}
