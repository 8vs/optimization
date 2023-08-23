<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    protected string $entity = 'tasks';

    public function up(): void
    {
        Schema::create(
            $this->entity,
            static function (Blueprint $table) {
                $table->id()->index();
                $table->string('name');
                $table->unsignedInteger('project_id');
                $table->json('characteristic');
                $table->timestamps();
            }
        );
    }

    public function down(): void
    {
        Schema::dropIfExists($this->entity);
    }
};
