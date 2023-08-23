<?php

declare(strict_types=1);

use App\Http\Enums\ProjectStatuses;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    protected string $entity = 'projects';

    public function up(): void
    {
        Schema::create(
            $this->entity,
            static function (Blueprint $table) {
                $table->id()->index();
                $table->string('title');
                $table->json('characteristic');
                $table->tinyInteger('status')->default(ProjectStatuses::STARTED);
                $table->json('result')->nullable();
                $table->timestamps();
            }
        );
    }

    public function down(): void
    {
        Schema::dropIfExists($this->entity);
    }
};
