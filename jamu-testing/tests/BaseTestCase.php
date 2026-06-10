<?php

namespace Tests;

use PHPUnit\Framework\TestCase;
use GuzzleHttp\Client;

class BaseTestCase extends TestCase
{
    protected Client $client;

    protected string $baseUrl = 'http://localhost:3000';

    protected const ADMIN_EMAIL = 'admin@jamukita.com';
    protected const ADMIN_PASSWORD = 'admin123';

    protected function setUp(): void
    {
        $this->client = new Client([
            'base_uri' => $this->baseUrl,
            'http_errors' => false
        ]);
    }

    protected function post($uri, $data = [])
    {
        return $this->client->post($uri, [
            'json' => $data
        ]);
    }

    protected function getAuthToken()
    {
        $response = $this->post('/v1/auth/login', [
            'email' => self::ADMIN_EMAIL,
            'password' => self::ADMIN_PASSWORD
        ]);

        $data = json_decode($response->getBody(), true);

        return $data['data']['access_token'] ?? null;
    }

    protected function getAdminToken()
    {
        $response = $this->post('/v1/auth/login', [
            'email' => self::ADMIN_EMAIL,
            'password' => self::ADMIN_PASSWORD
        ]);

        $data = json_decode($response->getBody(), true);

        if (!isset($data['data']['access_token'])) {
            return null;
        }

        return $data['data']['access_token'];
    }

    protected function getResepId()
    {
        $response = $this->client->get('/v1/resep');
        $data = json_decode($response->getBody(), true);

        return $data['data'][0]['id'];
    }
}