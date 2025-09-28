<?php

declare(strict_types=1);

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

require __DIR__ . '/vendor/autoload.php';

/**
 * Redirect helper with status and message.
 */
function redirect_with_status(string $status, string $message): void
{
    $params = [
        'status' => $status,
        'message' => $message,
    ];

    header('Location: contato.html?' . http_build_query($params));
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    redirect_with_status('error', 'Método de envio inválido.');
}

$nome = isset($_POST['nome']) ? trim((string) $_POST['nome']) : '';
$email = isset($_POST['email']) ? trim((string) $_POST['email']) : '';
$assunto = isset($_POST['assunto']) ? trim((string) $_POST['assunto']) : '';
$mensagem = isset($_POST['mensagem']) ? trim((string) $_POST['mensagem']) : '';

$nome = preg_replace('/[\r\n]+/', ' ', $nome);
$assunto = preg_replace('/[\r\n]+/', ' ', $assunto);
$email = preg_replace('/[\r\n]+/', '', $email);

if ($nome === '' || $email === '' || $mensagem === '') {
    redirect_with_status('error', 'Preencha todos os campos obrigatórios.');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    redirect_with_status('error', 'Informe um email válido.');
}

$assuntoEmail = $assunto !== '' ? $assunto : 'Nova mensagem pelo site ;paradigma';

$bodyHtml = '<h2>Novo contato pelo site ;paradigma</h2>';
$bodyHtml .= '<p><strong>Nome:</strong> ' . htmlspecialchars($nome, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . '</p>';
$bodyHtml .= '<p><strong>Email:</strong> ' . htmlspecialchars($email, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . '</p>';
$bodyHtml .= '<p><strong>Assunto:</strong> ' . htmlspecialchars($assuntoEmail, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . '</p>';
$bodyHtml .= '<p><strong>Mensagem:</strong></p>';
$bodyHtml .= '<p>' . nl2br(htmlspecialchars($mensagem, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8')) . '</p>';

$bodyText = "Novo contato pelo site ;paradigma\n";
$bodyText .= 'Nome: ' . $nome . "\n";
$bodyText .= 'Email: ' . $email . "\n";
$bodyText .= 'Assunto: ' . $assuntoEmail . "\n\n";
$bodyText .= "Mensagem:\n" . $mensagem . "\n";

try {
    $mail = new PHPMailer(true);
    $mail->CharSet = 'UTF-8';
    $mail->isMail();
    $mail->setFrom($email, $nome);
    $mail->addAddress('newsletter@siteparadigma.com.br', 'Contato ;paradigma');
    $mail->addReplyTo($email, $nome);
    $mail->Subject = $assuntoEmail;
    $mail->isHTML(true);
    $mail->Body = $bodyHtml;
    $mail->AltBody = $bodyText;

    $mail->send();
} catch (Exception $exception) {
    redirect_with_status('error', 'Não foi possível enviar sua mensagem. Tente novamente em instantes.');
} catch (\Throwable $throwable) {
    redirect_with_status('error', 'Ocorreu um erro inesperado ao enviar a mensagem.');
}

redirect_with_status('success', 'Mensagem enviada com sucesso! Em breve entraremos em contato.');
