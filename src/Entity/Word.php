<?php

namespace App\Entity;

use App\Repository\WordRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=WordRepository::class)
 */
class Word
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255, unique=true)
     */
    private $kanji;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $romaji;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $francais;

    /**
     * @ORM\Column(type="string", nullable=true)
     */
    private $infos;

    /**
     * @ORM\Column(type="datetime")
     */
    private $createdAt;

    /**
     * @ORM\ManyToOne(targetEntity=Type::class, inversedBy="words")
     */
    private $type;

    /**
     * @ORM\ManyToOne(targetEntity=VerbeGroupe::class, inversedBy="words")
     */
    private $verbe_groupe;

    /**
     * @ORM\ManyToOne(targetEntity=Theme::class, inversedBy="words")
     */
    private $theme;

    /**
     * @ORM\OneToMany(targetEntity=WordReport::class, mappedBy="word")
     */
    private $wordReports;

    public function __construct()
    {
        $this->wordReports = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getKanji(): ?string
    {
        return $this->kanji;
    }

    public function setKanji(?string $kanji): self
    {
        $this->kanji = $kanji;

        return $this;
    }

    public function getRomaji(): ?string
    {
        return $this->romaji;
    }

    public function setRomaji(?string $romaji): self
    {
        $this->romaji = $romaji;

        return $this;
    }

    public function getFrancais(): ?string
    {
        return $this->francais;
    }

    public function setFrancais(?string $francais): self
    {
        $this->francais = $francais;

        return $this;
    }

    public function getInfos(): ?string
    {
        return $this->infos;
    }

    public function setInfos(?string $infos): self
    {
        $this->infos = $infos;

        return $this;
    }

    public function getType(): ?Type
    {
        return $this->type;
    }

    public function setType(?Type $type): self
    {
        $this->type = $type;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeInterface $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getVerbeGroupe(): ?VerbeGroupe
    {
        return $this->verbe_groupe;
    }

    public function setVerbeGroupe(?VerbeGroupe $verbe_groupe): self
    {
        $this->verbe_groupe = $verbe_groupe;

        return $this;
    }

    public function getTheme(): ?Theme
    {
        return $this->theme;
    }

    public function setTheme(?Theme $theme): self
    {
        $this->theme = $theme;

        return $this;
    }

    /**
     * @return Collection|WordReport[]
     */
    public function getWordReports(): Collection
    {
        return $this->wordReports;
    }

    public function addWordReport(WordReport $wordReport): self
    {
        if (!$this->wordReports->contains($wordReport)) {
            $this->wordReports[] = $wordReport;
            $wordReport->setWord($this);
        }

        return $this;
    }

    public function removeWordReport(WordReport $wordReport): self
    {
        if ($this->wordReports->contains($wordReport)) {
            $this->wordReports->removeElement($wordReport);
            // set the owning side to null (unless already changed)
            if ($wordReport->getWord() === $this) {
                $wordReport->setWord(null);
            }
        }

        return $this;
    }
}
