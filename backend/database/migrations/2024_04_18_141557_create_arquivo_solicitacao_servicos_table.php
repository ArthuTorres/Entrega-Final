<?php

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
        Schema::create('arquivo_solicitacao_servicos', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->foreignIdFor(SolicitacaoServico::class)->constrained()->cascadeOnDelete();
            $table->longText('arquivo')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('arquivo_solicitacao_servicos');
    }
};
