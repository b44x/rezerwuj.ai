<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260206150642 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE saved_comparison (id UUID NOT NULL, name VARCHAR(255) NOT NULL, offer_ids JSON NOT NULL, share_token VARCHAR(64) NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, user_id INT NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_2673933ED6594DD6 ON saved_comparison (share_token)');
        $this->addSql('CREATE INDEX IDX_2673933EA76ED395 ON saved_comparison (user_id)');
        $this->addSql('ALTER TABLE saved_comparison ADD CONSTRAINT FK_2673933EA76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) NOT DEFERRABLE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE saved_comparison DROP CONSTRAINT FK_2673933EA76ED395');
        $this->addSql('DROP TABLE saved_comparison');
    }
}
