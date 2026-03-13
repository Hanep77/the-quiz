<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OptionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        // Ideally we check if user is creator.
        // Assuming relationship is loaded or accessible.
        // If not loaded, this might cause N+1, but for a single quiz show it's negligible (1 quiz).
        // For list of quizzes, we don't show options usually.
        
        $isCreator = false;
        if ($this->question && $this->question->quiz) {
            $isCreator = $request->user()?->id === $this->question->quiz->created_by;
        }

        return [
            'id' => $this->id,
            'text' => $this->text,
            'is_correct' => $this->when($isCreator, $this->is_correct),
        ];
    }
}
