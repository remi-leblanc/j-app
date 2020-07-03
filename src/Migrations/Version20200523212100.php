<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200523212100 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE word CHANGE verbe_groupe verbe_groupe_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE word ADD CONSTRAINT FK_C3F17511101A1138 FOREIGN KEY (verbe_groupe_id) REFERENCES verbe_groupe (id)');
        $this->addSql('CREATE INDEX IDX_C3F17511101A1138 ON word (verbe_groupe_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE word DROP FOREIGN KEY FK_C3F17511101A1138');
        $this->addSql('DROP INDEX IDX_C3F17511101A1138 ON word');
        $this->addSql('ALTER TABLE word CHANGE verbe_groupe_id verbe_groupe INT DEFAULT NULL');
    }
}
