<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260206133654 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // Step 1: Add slug column as nullable
        $this->addSql('ALTER TABLE hotel ADD slug VARCHAR(255) DEFAULT NULL');

        // Step 2: Generate slugs for existing hotels
        $this->addSql("
            UPDATE hotel
            SET slug = LOWER(REGEXP_REPLACE(
                CONCAT(name, '-', city),
                '[^a-z0-9]+',
                '-',
                'g'
            ))
        ");

        // Step 3: Make slug NOT NULL and add unique constraint
        $this->addSql('ALTER TABLE hotel ALTER COLUMN slug SET NOT NULL');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_3535ED9989D9B62 ON hotel (slug)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP INDEX UNIQ_3535ED9989D9B62');
        $this->addSql('ALTER TABLE hotel DROP slug');
    }
}
