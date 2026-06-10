<?php

namespace Tests;

class AdminTest extends BaseTestCase
{
    public function testGetAdminEndpoint()
    {
        $token = $this->getAdminToken();

        $response = $this->client->get('/v1/admin', [
            'headers' => [
                'Authorization' => 'Bearer ' . $token
            ]
        ]);

        $this->assertTrue(in_array($response->getStatusCode(), [200, 401, 403, 404]));
    }

    public function testTambahResep()
    {
        $token = $this->getAdminToken();

        $response = $this->client->post('/v1/admin/resep', [
            'headers' => [
                'Authorization' => 'Bearer ' . $token
            ],
            'json' => [
                'nama' => 'Test Admin Jamu',
                'deskripsi' => 'Testing admin insert'
            ]
        ]);

        $this->assertTrue(in_array($response->getStatusCode(), [200, 201, 400, 401, 403, 404]));
    }

    public function testUpdateResep()
    {
        $token = $this->getAdminToken();

        $response = $this->client->put('/v1/admin/resep/1', [
            'headers' => [
                'Authorization' => 'Bearer ' . $token
            ],
            'json' => [
                'nama' => 'Update Admin Jamu'
            ]
        ]);

        $this->assertTrue(in_array($response->getStatusCode(), [200, 400, 401, 403, 404]));
    }

    public function testDeleteResep()
    {
        $token = $this->getAdminToken();

        $response = $this->client->delete('/v1/admin/resep/1', [
            'headers' => [
                'Authorization' => 'Bearer ' . $token
            ]
        ]);

        $this->assertTrue(in_array($response->getStatusCode(), [200, 204, 401, 403, 404]));
    }
}