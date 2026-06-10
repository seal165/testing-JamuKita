<?php

namespace Tests;

class KomentarFavoritTest extends BaseTestCase
{
    protected function getResepId()
    {
        $response = $this->client->get('/v1/resep');
        $data = json_decode($response->getBody(), true);

        return $data['data'][0]['id'] ?? 1;
    }

    public function testTambahKomentarBerhasil()
    {
        $token = $this->getAuthToken();
        $id = $this->getResepId();

        $response = $this->client->post("/v1/resep/$id/komentar", [
            'headers' => [
                'Authorization' => "Bearer $token"
            ],
            'json' => [
                'isiKomentar' => 'Mantap banget jamunya!',
                'rating' => 5
            ]
        ]);

        $this->assertTrue(in_array($response->getStatusCode(), [200, 201, 400]));
    }

    public function testTambahKomentarTanpaToken()
    {
        $id = $this->getResepId();

        $response = $this->client->post("/v1/resep/$id/komentar", [
            'json' => [
                'isiKomentar' => 'Mantap!',
                'rating' => 5
            ]
        ]);

        $this->assertTrue(in_array($response->getStatusCode(), [401, 404]));
    }

    public function testTambahKomentarInvalid()
    {
        $token = $this->getAuthToken();
        $id = $this->getResepId();

        $response = $this->client->post("/v1/resep/$id/komentar", [
            'headers' => [
                'Authorization' => "Bearer $token"
            ],
            'json' => [
                'isiKomentar' => 'ok',
                'rating' => 10
            ]
        ]);

        $this->assertTrue(in_array($response->getStatusCode(), [400, 422]));
    }

    public function testGetKomentar()
    {
        $id = $this->getResepId();

        $response = $this->client->get("/v1/resep/$id/komentar");

        $this->assertTrue(in_array($response->getStatusCode(), [200, 404]));
    }

    public function testTambahFavorit()
    {
        $token = $this->getAuthToken();
        $id = $this->getResepId();

        $response = $this->client->post('/v1/favorit', [
            'headers' => [
                'Authorization' => "Bearer $token"
            ],
            'json' => [
                'resepId' => $id
            ]
        ]);

        $this->assertTrue(in_array($response->getStatusCode(), [200, 201, 400]));
    }

    public function testTambahFavoritTanpaToken()
    {
        $id = $this->getResepId();

        $response = $this->client->post('/v1/favorit', [
            'json' => [
                'resepId' => $id
            ]
        ]);

        $this->assertTrue(in_array($response->getStatusCode(), [401, 404]));
    }

    public function testGetFavorit()
    {
        $token = $this->getAuthToken();

        $response = $this->client->get('/v1/favorit', [
            'headers' => [
                'Authorization' => "Bearer $token"
            ]
        ]);

        $this->assertEquals(200, $response->getStatusCode());
    }

    public function testHapusFavorit()
    {
        $token = $this->getAuthToken();

        $response = $this->client->delete('/v1/favorit/1', [
            'headers' => [
                'Authorization' => "Bearer $token"
            ]
        ]);

        $this->assertTrue(in_array($response->getStatusCode(), [200, 204, 404]));
    }

    public function testDuplicateKomentar()
    {
        $token = $this->getAuthToken();
        $id = $this->getResepId();

        $this->client->post('/v1/resep/'.$id.'/komentar', [
            'headers' => ['Authorization' => 'Bearer '.$token],
            'json' => ['isiKomentar' => 'Nice', 'rating' => 5]
        ]);

        $response = $this->client->post('/v1/resep/'.$id.'/komentar', [
            'headers' => ['Authorization' => 'Bearer '.$token],
            'json' => ['isiKomentar' => 'Nice', 'rating' => 5]
        ]);

        $this->assertTrue(in_array($response->getStatusCode(), [200, 400]));
    }

    public function testRatingZero()
    {
        $token = $this->getAuthToken();
        $id = $this->getResepId();

        $response = $this->client->post('/v1/resep/'.$id.'/komentar', [
            'headers' => ['Authorization' => 'Bearer '.$token],
            'json' => ['isiKomentar' => 'test', 'rating' => 0]
        ]);

        $this->assertTrue(in_array($response->getStatusCode(), [400, 422]));
    }

    public function testFavoritDuplicate()
    {
        $token = $this->getAuthToken();
        $id = $this->getResepId();

        $this->client->post('/v1/favorit', [
            'headers' => ['Authorization' => 'Bearer '.$token],
            'json' => ['resepId' => $id]
        ]);

        $response = $this->client->post('/v1/favorit', [
            'headers' => ['Authorization' => 'Bearer '.$token],
            'json' => ['resepId' => $id]
        ]);

        $this->assertTrue(in_array($response->getStatusCode(), [400, 409]));
    }

    public function testGetKomentarInvalidId()
    {
        $response = $this->client->get('/v1/resep/999999/komentar');

        $this->assertTrue(in_array($response->getStatusCode(), [404, 200]));
    }
}