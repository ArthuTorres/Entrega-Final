<?php

use App\Models\Cliente;
use App\Models\SolicitacaoServico;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('avaliacao_clientes', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->foreignIdFor(SolicitacaoServico::class);
            $table->foreignIdFor(Cliente::class);
            $table->text("titulo");
            $table->longText("mensagem");
            $table->integer("nota_cliente");
            $table->integer("nota_sistema");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('avaliacao_clientes');
    }
};
