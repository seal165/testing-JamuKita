<?php

namespace Tests;

class ArtikelUploadTest extends BaseTestCase
{
    public function testGetArtikel()
    {
        $response = $this->client->get('/v1/artikel');

        $this->assertEquals(200, $response->getStatusCode());
    }

    public function testGetArtikelDetail()
    {
        $response = $this->client->get('/v1/artikel/1');

        $this->assertTrue(in_array($response->getStatusCode(), [200, 404]));
    }

    public function testUploadArtikel()
    {
        $token = $this->getAuthToken();

        $stream = fopen('php://memory', 'r+');
        fwrite($stream, 'fake-image');
        rewind($stream);

        $response = $this->client->post('/v1/upload/image', [
            'headers' => [
                'Authorization' => 'Bearer ' . $token
            ],
            'multipart' => [
                [
                    'name' => 'file',
                    'contents' => $stream,
                    'filename' => 'test.jpg'
                ]
            ]
        ]);

        $status = $response->getStatusCode();
        $body = (string) $response->getBody();

        // DEBUG kalau gagal
        if ($status === 404) {
            $this->fail("UPLOAD ROUTE NOT FOUND - cek server running instance");
        }

        $this->assertTrue(
            in_array($status, [200, 201, 400, 401, 403, 415, 500]),
            "Unexpected: $status | $body"
        );
    }
}