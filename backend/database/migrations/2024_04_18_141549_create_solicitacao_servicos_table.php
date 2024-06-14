<?php

use App\Models\Cliente;
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
        Schema::create('solicitacao_servicos', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->foreignIdFor(Cliente::class)->constrained()->cascadeOnDelete();
            $table->string("tipo_equipamento");
            $table->string("marca");
            $table->string("modelo");
            $table->string("periodo_preferencial");
            $table->longText("descricao_problema");
            $table->integer("status");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('solicitacao_servicos');
    }
};
