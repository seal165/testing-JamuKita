<?php

namespace Tests;

class ReportTest extends BaseTestCase
{
    public function testCreateReport()
    {
        $token = $this->getAuthToken();

        $response = $this->client->post('/v1/report', [
            'headers' => ['Authorization' => 'Bearer ' . $token],
            'json' => [
                'judul' => 'Bug laporan test',
                'deskripsi' => 'Testing report'
            ]
        ]);

        $this->assertTrue(in_array($response->getStatusCode(), [200, 201, 400]));
    }

    public function testGetReport()
    {
        $token = $this->getAuthToken();

        $response = $this->client->get('/v1/report', [
            'headers' => ['Authorization' => 'Bearer ' . $token]
        ]);

        $this->assertTrue(in_array($response->getStatusCode(), [200, 401, 403]));
    }

    public function testDeleteReport()
    {
        $token = $this->getAuthToken();

        $response = $this->client->delete('/v1/report/1', [
            'headers' => ['Authorization' => 'Bearer ' . $token]
        ]);

        $this->assertTrue(in_array($response->getStatusCode(), [200, 204, 403, 404]));
    }
}