<?php

namespace App\Controller;

use App\Entity\Category;
use App\Repository\CategoryRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api', name: 'api_category_')]
class CategoryController extends AbstractController
{
    // LIST CATEGORIES
    #[Route('/categories', name: 'list', methods: ['GET'])]
    public function index(CategoryRepository $categoryRepository): JsonResponse
    {
        $user = $this->getUser();
        // Sort by type (expense first) then name
        $categories = $categoryRepository->findBy(['user' => $user], ['type' => 'ASC', 'name' => 'ASC']);

        $data = [];
        foreach ($categories as $category) {
            $data[] = [
                'id' => $category->getId(),
                'name' => $category->getName(),
                'type' => $category->getType(),
            ];
        }

        return $this->json($data);
    }

    // CREATE CATEGORY
    #[Route('/categories', name: 'create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $user = $this->getUser();

        if (empty($data['name']) || empty($data['type'])) {
            return $this->json(['message' => 'Name and Type are required'], 400);
        }

        if (!in_array($data['type'], ['income', 'expense'])) {
            return $this->json(['message' => 'Type must be income or expense'], 400);
        }

        $category = new Category();
        $category->setName($data['name']);
        $category->setType($data['type']);
        $category->setUser($user);

        $entityManager->persist($category);
        $entityManager->flush();

        return $this->json([
            'id' => $category->getId(),
            'name' => $category->getName(),
            'type' => $category->getType(),
            'message' => 'Category created successfully'
        ], 201);
    }

    // DELETE CATEGORY
    #[Route('/categories/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(Category $category, EntityManagerInterface $entityManager): JsonResponse
    {
        // Making sure the user owns this category
        if ($category->getUser() !== $this->getUser()) {
            return $this->json(['message' => 'Unauthorized'], 403);
        }

        $entityManager->remove($category);
        $entityManager->flush();

        return $this->json(['message' => 'Category deleted']);
    }
}