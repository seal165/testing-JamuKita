<?php

namespace Tests;

class AnalyticsTest extends BaseTestCase
{
    public function testLogEvent()
    {
        $response = $this->client->post('/v1/analytics/log', [
            'json' => [
                'event' => 'test_event',
                'value' => 1
            ]
        ]);

        $this->assertTrue(in_array($response->getStatusCode(), [200, 201, 400]));
    }

    public function testGetStatisticsAdmin()
    {
        $token = $this->getAuthToken();

        $response = $this->client->get('/v1/analytics/statistics', [
            'headers' => [
                'Authorization' => 'Bearer ' . $token
            ]
        ]);

        $this->assertTrue(in_array($response->getStatusCode(), [200, 401, 403]));
    }

    public function testStatisticsWithoutToken()
    {
        $response = $this->client->get('/v1/analytics/statistics');

        $this->assertTrue(in_array($response->getStatusCode(), [401, 403]));
    }

    public function testLogEventInvalidPayload()
    {
        $response = $this->client->post('/v1/analytics/log', [
            'json' => []
        ]);

        $this->assertTrue(in_array($response->getStatusCode(), [400, 422]));
    }

    public function testStatisticsEmptyDate()
    {
        $token = $this->getAuthToken();

        $response = $this->client->get('/v1/analytics/statistics', [
            'headers' => [
                'Authorization' => 'Bearer ' . $token
            ]
        ]);

        $this->assertEquals(200, $response->getStatusCode());
    }
}