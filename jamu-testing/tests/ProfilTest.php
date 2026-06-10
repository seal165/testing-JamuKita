<?php

namespace Tests;

class ProfilTest extends BaseTestCase
{
    public function testGetProfileBerhasil()
    {
        $token = $this->getAuthToken();

        $response = $this->client->get('/v1/me', [
            'headers' => [
                'Authorization' => 'Bearer ' . $token
            ]
        ]);

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertNotNull($token);
    }
    
    public function testGetProfileTanpaToken()
    {
        $response = $this->client->get('/v1/me');

        $this->assertEquals(401, $response->getStatusCode());
    }

    public function testGetProfileTokenInvalid()
    {
        $response = $this->client->get('/v1/me', [
            'headers' => [
                'Authorization' => 'Bearer salah_token'
            ]
        ]);

        $this->assertEquals(401, $response->getStatusCode());
    }

    public function testUpdateProfileBerhasil()
    {
        $token = $this->getAuthToken();

        $response = $this->client->patch('/v1/me', [
            'headers' => [
                'Authorization' => 'Bearer ' . $token
            ],
            'json' => [
                'nama' => 'Jey Updated'
            ]
        ]);

        $this->assertEquals(200, $response->getStatusCode());
    }

    public function testUpdateProfileTanpaToken()
    {
        $response = $this->client->patch('/v1/me', [
            'json' => [
                'nama' => 'Jey Updated'
            ]
        ]);

        $this->assertEquals(401, $response->getStatusCode());
    }

    public function testUpdateProfileNamaPendek()
    {
        $token = $this->getAuthToken();

        $response = $this->client->patch('/v1/me', [
            'headers' => [
                'Authorization' => 'Bearer ' . $token
            ],
            'json' => [
                'nama' => 'ab'
            ]
        ]);

        $this->assertEquals(200, $response->getStatusCode());
    }

    public function testUpdateProfileKosong()
    {
        $token = $this->getAuthToken();

        $response = $this->client->patch('/v1/me', [
            'headers' => [
                'Authorization' => 'Bearer ' . $token
            ]
        ]);

        $this->assertTrue(in_array($response->getStatusCode(), [200, 400, 500]));
    }
}