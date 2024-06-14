<?php

use App\Models\PrestadorServico;
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
        Schema::create('proposta_servicos', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->foreignIdFor(SolicitacaoServico::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(PrestadorServico::class)->constrained()->cascadeOnDelete();

            $table->longText("descricao_proposta");
            $table->longText("valor_servico");
            $table->longText("prazo");
            $table->integer("status")->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('proposta_servicos');
    }
};
