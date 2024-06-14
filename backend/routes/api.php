<?php

use App\Http\Controllers\ArquivoSolicitacaoServicoController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AvaliacaoClienteController;
use App\Http\Controllers\AvaliacaoPrestadorController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\EnderecoController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PrestadorServicoController;
use App\Http\Controllers\PropostaController;
use App\Http\Controllers\SolicitacaoServicoController;
use App\Http\Controllers\UsuarioController;
use Illuminate\Support\Facades\Route;

Route::get('ping', function () {
    return response("pong");
});

Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function ($router) {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::post('me', [AuthController::class, 'me']);
});


Route::group([
    'middleware' => 'api',
    'prefix' => 'enderecos'
], function ($router) {
    Route::get('busca-cep/{cep}', [EnderecoController::class, 'buscarCep']);
});

Route::group([
    'middleware' => 'api',
    'prefix' => 'usuarios'
], function ($router) {
    Route::post('signup', [UsuarioController::class, 'signup']);
});

Route::group([
    'middleware' => 'api',
    'prefix' => 'clientes'
], function ($router) {
    Route::post('signup', [ClienteController::class, 'signup']);
});

Route::group([
    'middleware' => 'api',
    'prefix' => 'prestadores-servico'
], function ($router) {
    Route::post('signup', [PrestadorServicoController::class, 'signup']);
});

Route::group([
    'middleware' => 'api',
    'prefix' => 'solicitacoes-servico'
], function ($router) {
    Route::get('tipos-equipamento', [SolicitacaoServicoController::class, 'tiposEquipamento']);
    Route::get('marcas', [SolicitacaoServicoController::class, 'marcas']);
    Route::get('modelos', [SolicitacaoServicoController::class, 'modelos']);
});

Route::group([
    'middleware' => 'api',
    'prefix' => 'messages/chats'
], function ($router) {
    Route::get('/', [MessageController::class, 'getChats']);
    Route::get('/{contactId}', [MessageController::class, 'getChat']);
});


Route::group(['middleware' => "api"], function ($router) {
    $generic_controller_routes = [
        "usuarios" => UsuarioController::class,
        "clientes" => ClienteController::class,
        "prestadores-servico" => PrestadorServicoController::class,
        "enderecos" => EnderecoController::class,
        "solicitacoes-servico" => SolicitacaoServicoController::class,
        "arquivos-solicitacoes-servico" => ArquivoSolicitacaoServicoController::class,
        "propostas" => PropostaController::class,
        "avaliacoes-prestador" => AvaliacaoPrestadorController::class,
        "avaliacoes-cliente" => AvaliacaoClienteController::class,
        "notificacoes" => NotificationController::class,
        "messages" => MessageController::class,
    ];

    foreach ($generic_controller_routes as $prefix => $controller) {
        Route::get($prefix . '/', [$controller, 'index']);
        Route::get($prefix . '/lookup', [$controller, 'lookup']);
        Route::get($prefix . '/{id}', [$controller, 'show']);
        Route::post($prefix . '/', [$controller, 'store']);
        Route::post($prefix . '/bulk', [$controller, 'bulk']);
        Route::post($prefix . '/{id}', [$controller, 'update']);
        Route::delete($prefix . '/{id}', [$controller, 'destroy']);
    }
});
