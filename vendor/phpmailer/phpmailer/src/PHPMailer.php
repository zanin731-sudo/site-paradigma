<?php

namespace PHPMailer\PHPMailer;

class PHPMailer
{
    public string $CharSet = 'UTF-8';
    public string $Encoding = '8bit';
    public string $Subject = '';
    public string $Body = '';
    public string $AltBody = '';
    public string $ErrorInfo = '';

    protected string $fromEmail = '';
    protected string $fromName = '';
    protected array $addresses = [];
    protected array $replyTo = [];
    protected bool $isHTML = false;
    protected bool $exceptions = false;

    public function __construct(bool $exceptions = false)
    {
        $this->exceptions = $exceptions;
    }

    public function isMail(): void
    {
        // Default mail transport; provided for interface compatibility.
    }

    public function isHTML(bool $isHtml = true): void
    {
        $this->isHTML = $isHtml;
    }

    public function setFrom(string $address, string $name = ''): bool
    {
        if (!$this->isValidEmail($address)) {
            return $this->setError('Endereço de email do remetente inválido.');
        }

        $this->fromEmail = $address;
        $this->fromName = $name;

        return true;
    }

    public function addAddress(string $address, string $name = ''): bool
    {
        if (!$this->isValidEmail($address)) {
            return $this->setError('Endereço de email do destinatário inválido.');
        }

        $this->addresses[] = [
            'email' => $address,
            'name' => $name,
        ];

        return true;
    }

    public function addReplyTo(string $address, string $name = ''): bool
    {
        if (!$this->isValidEmail($address)) {
            return $this->setError('Endereço de email de resposta inválido.');
        }

        $this->replyTo[] = [
            'email' => $address,
            'name' => $name,
        ];

        return true;
    }

    public function send(): bool
    {
        if ($this->fromEmail === '') {
            return $this->setError('Remetente não definido.');
        }

        if (empty($this->addresses)) {
            return $this->setError('Nenhum destinatário informado.');
        }

        $to = array_map(fn ($address) => $this->formatAddress($address['email'], $address['name']), $this->addresses);

        $headers = [];
        $headers[] = $this->headerLine('From', $this->formatAddress($this->fromEmail, $this->fromName));

        if (!empty($this->replyTo)) {
            $replyTo = array_map(fn ($address) => $this->formatAddress($address['email'], $address['name']), $this->replyTo);
            $headers[] = $this->headerLine('Reply-To', implode(', ', $replyTo));
        }

        $headers[] = $this->headerLine('MIME-Version', '1.0');
        $headers[] = $this->headerLine(
            'Content-Type',
            ($this->isHTML ? 'text/html' : 'text/plain') . '; charset=' . $this->CharSet
        );
        $headers[] = $this->headerLine('Content-Transfer-Encoding', $this->Encoding);

        $subject = $this->encodeHeader($this->Subject);
        $body = $this->isHTML ? $this->Body : ($this->AltBody !== '' ? $this->AltBody : $this->Body);

        $result = mail(implode(', ', $to), $subject, $body, implode("\r\n", $headers));

        if ($result === false) {
            return $this->setError('Falha ao enviar o email.');
        }

        return true;
    }

    protected function headerLine(string $name, string $value): string
    {
        return sprintf('%s: %s', $name, $value);
    }

    protected function formatAddress(string $email, string $name = ''): string
    {
        $cleanName = trim($name);
        if ($cleanName === '') {
            return $email;
        }

        return sprintf('%s <%s>', $this->encodeHeader($cleanName), $email);
    }

    protected function encodeHeader(string $value): string
    {
        $needsEncoding = preg_match('/[^\x20-\x7E]/', $value) === 1;

        if ($needsEncoding) {
            return '=?' . $this->CharSet . '?B?' . base64_encode($value) . '?=';
        }

        return $value;
    }

    protected function isValidEmail(string $address): bool
    {
        return (bool) filter_var($address, FILTER_VALIDATE_EMAIL);
    }

    protected function setError(string $message): bool
    {
        $this->ErrorInfo = $message;

        if ($this->exceptions) {
            throw new Exception($message);
        }

        return false;
    }
}
