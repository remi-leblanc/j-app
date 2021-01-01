<?php

namespace App\Entity;

use App\Repository\TypeRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=TypeRepository::class)
 */
class Type
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
    private $name;

    /**
     * @ORM\OneToMany(targetEntity=Word::class, mappedBy="type")
     */
    private $words;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $SplitGroupCount;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $splitGroupSize;

    public function __construct()
    {
        $this->words = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return Collection|Word[]
     */
    public function getWords(): Collection
    {
        return $this->words;
    }

    public function addWord(Word $word): self
    {
        if (!$this->words->contains($word)) {
            $this->words[] = $word;
            $word->setType($this);
        }

        return $this;
    }

    public function removeWord(Word $word): self
    {
        if ($this->words->contains($word)) {
            $this->words->removeElement($word);
            // set the owning side to null (unless already changed)
            if ($word->getType() === $this) {
                $word->setType(null);
            }
        }

        return $this;
    }

    public function getSplitGroupCount(): ?int
    {
        return $this->SplitGroupCount;
    }

    public function setSplitGroupCount(?int $SplitGroupCount): self
    {
        $this->SplitGroupCount = $SplitGroupCount;

        return $this;
    }

    public function getSplitGroupSize(): ?int
    {
        return $this->splitGroupSize;
    }

    public function setSplitGroupSize(?int $splitGroupSize): self
    {
        $this->splitGroupSize = $splitGroupSize;

        return $this;
    }
}
