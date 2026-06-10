<?php

namespace Tests;

class AuthTest extends BaseTestCase
{
    public function testLoginBerhasil()
    {
        $response = $this->post('/v1/auth/login', [
            'email' => self::ADMIN_EMAIL,
            'password' => self::ADMIN_PASSWORD
        ]);

        $this->assertEquals(200, $response->getStatusCode());
    }

    public function testLoginGagalPasswordSalah()
    {
        $response = $this->post('/v1/auth/login', [
            'email' => self::ADMIN_EMAIL,
            'password' => 'salah123'
        ]);

        $this->assertEquals(401, $response->getStatusCode());
    }

    public function testRegisterBerhasil()
    {
        $response = $this->post('/v1/auth/register', [
            'nama' => 'User Test',
            'email' => 'user' . rand(1,9999) . '@mail.com',
            'password' => 'password123'
        ]);

        $this->assertEquals(201, $response->getStatusCode());
    }

    public function testLoginEmailTidakAda()
    {
        $response = $this->post('/v1/auth/login', [
            'email' => 'tidakada@mail.com',
            'password' => 'password123'
        ]);

        $this->assertEquals(401, $response->getStatusCode());
    }

    public function testLoginTanpaPassword()
    {
        $response = $this->post('/v1/auth/login', [
            'email' => self::ADMIN_EMAIL
        ]);

        $this->assertEquals(400, $response->getStatusCode());
    }

    public function testRegisterNamaPendek()
    {
        $response = $this->post('/v1/auth/register', [
            'nama' => 'ab',
            'email' => 'test' . rand(1,9999) . '@mail.com',
            'password' => 'password123'
        ]);

        $this->assertEquals(400, $response->getStatusCode());
    }

    public function testRegisterPasswordPendek()
    {
        $response = $this->post('/v1/auth/register', [
            'nama' => 'User Test',
            'email' => 'test' . rand(1,9999) . '@mail.com',
            'password' => '123'
        ]);

        $this->assertEquals(400, $response->getStatusCode());
    }

    public function testRegisterTanpaEmail()
    {
        $response = $this->post('/v1/auth/register', [
            'nama' => 'User Test',
            'password' => 'password123'
        ]);

        $this->assertEquals(400, $response->getStatusCode());
    }

    public function testRegisterEmailInvalid()
    {
        $response = $this->post('/v1/auth/register', [
            'nama' => 'User Test',
            'email' => 'salahformat',
            'password' => 'password123'
        ]);

        $this->assertEquals(400, $response->getStatusCode());
    }

    public function testRegisterEmailDuplikat()
    {
        $response = $this->post('/v1/auth/register', [
            'nama' => 'User Duplikat',
            'email' => self::ADMIN_EMAIL, // sudah ada dari seed
            'password' => 'password123'
        ]);

        $this->assertTrue(in_array($response->getStatusCode(), [400, 409]));
    }

    public function testLoginEmailUppercase()
    {
        $response = $this->post('/v1/auth/login', [
            'email' => strtoupper(self::ADMIN_EMAIL),
            'password' => self::ADMIN_PASSWORD
        ]);

        $this->assertTrue(in_array($response->getStatusCode(), [200, 401]));
    }

    public function testLoginWithWrongFormatEmail()
    {
        $response = $this->post('/v1/auth/login', [
            'email' => 'admin@@jamukita..com',
            'password' => self::ADMIN_PASSWORD
        ]);

        $this->assertTrue(in_array($response->getStatusCode(), [400, 401]));
    }

    public function testLoginEmptyPayload()
    {
        $response = $this->post('/v1/auth/login', []);

        $this->assertEquals(400, $response->getStatusCode());
    }
}