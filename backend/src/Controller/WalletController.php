<?php

namespace App\Controller;

use App\Entity\Wallet;
use App\Repository\WalletRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api', name: 'api_wallet_')]
class WalletController extends AbstractController
{
    // GET ALL WALLETS (For the current user only)
    #[Route('/wallets', name: 'list', methods: ['GET'])]
    public function index(WalletRepository $walletRepository): JsonResponse
    {
        $user = $this->getUser();
        
        // Find wallets belonging to the logged-in user
        $wallets = $walletRepository->findBy(['user' => $user]);

        $data = [];
        foreach ($wallets as $wallet) {
            $data[] = [
                'id' => $wallet->getId(),
                'name' => $wallet->getName(),
                'balance' => $wallet->getBalance(),
            ];
        }

        return $this->json($data);
    }

    // CREATE A WALLET
    #[Route('/wallets', name: 'create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $user = $this->getUser();

        if (empty($data['name'])) {
            return $this->json(['message' => 'Name is required'], 400);
        }

        $wallet = new Wallet();
        $wallet->setName($data['name']);
        $wallet->setBalance($data['balance'] ?? 0.00); // Default to 0 if not sent
        $wallet->setCreatedAt(new \DateTimeImmutable());
        $wallet->setUser($user);

        $entityManager->persist($wallet);
        $entityManager->flush();

        return $this->json([
            'id' => $wallet->getId(),
            'name' => $wallet->getName(),
            'balance' => $wallet->getBalance(),
            'message' => 'Wallet created successfully'
        ], 201);
    }
}