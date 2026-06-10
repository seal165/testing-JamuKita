<?php

namespace Tests;

class ResepTest extends BaseTestCase
{
    public function testGetSemuaResep()
    {
        $response = $this->client->get('/v1/resep');

        $this->assertEquals(200, $response->getStatusCode());
    }

    public function testSearchResep()
    {
        $token = $this->getAuthToken();

        $response = $this->client->get('/v1/resep/search?keyword=jahe', [
            'headers' => [
                'Authorization' => 'Bearer ' . $token
            ]
        ]);

        $this->assertEquals(200, $response->getStatusCode());
    }

    public function testPaginationResep()
    {
        $response = $this->client->get('/v1/resep?page=1&limit=10');

        $this->assertEquals(200, $response->getStatusCode());
    }

    public function testGetResepByIdBerhasil()
    {
        $list = $this->client->get('/v1/resep');
        $data = json_decode($list->getBody(), true);

        $id = $data['data'][0]['id'] ?? null;

        $this->assertNotNull($id);

        $response = $this->client->get('/v1/resep/' . $id);

        $this->assertEquals(200, $response->getStatusCode());
    }

    public function testGetResepByIdTidakAda()
    {
        $response = $this->client->get('/v1/resep/999999');
        $this->assertEquals(404, $response->getStatusCode());
    }

    public function testSearchResepTanpaToken()
    {
        $response = $this->client->get('/v1/resep/search?keyword=jahe');
        $this->assertEquals(401, $response->getStatusCode());
    }

    public function testSearchKeywordPendek()
    {
        $token = $this->getAuthToken();

        $response = $this->client->get('/v1/resep/search?keyword=a', [
            'headers' => [
                'Authorization' => 'Bearer ' . $token
            ]
        ]);

        $this->assertEquals(400, $response->getStatusCode());
    }

    public function testSearchKeywordKosong()
    {
        $token = $this->getAuthToken();

        $response = $this->client->get('/v1/resep/search', [
            'headers' => [
                'Authorization' => 'Bearer ' . $token
            ]
        ]);

        $this->assertEquals(200, $response->getStatusCode());
    }

    public function testPaginationPageBesar()
    {
        $response = $this->client->get('/v1/resep?page=9999&limit=10');

        $this->assertTrue(in_array($response->getStatusCode(), [200, 404]));
    }

    public function testPaginationLimitTerlaluBesar()
    {
        $response = $this->client->get('/v1/resep?page=1&limit=1000');

        $this->assertTrue(in_array($response->getStatusCode(), [200, 400]));
    }

    public function testFilterKategoriInvalid()
    {
        $response = $this->client->get('/v1/resep?kategori=999999');

        $this->assertTrue(in_array($response->getStatusCode(), [200, 404]));
    }

    public function testSortResepByRating()
    {
        $response = $this->client->get('/v1/resep?sort=rating');

        $this->assertTrue(in_array($response->getStatusCode(), [200, 400]));
    }

    public function testSearchSpasiKosong()
    {
        $response = $this->client->get('/v1/resep/search?q=   ');

        $status = $response->getStatusCode();

        $this->assertTrue(
            in_array($status, [200, 400, 401, 404, 422, 500])
        );
    }
}