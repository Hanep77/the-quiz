<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateQuizRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->id === $this->route('quiz')->created_by;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'questions' => 'sometimes|array|min:1',
            'questions.*.text' => 'required_with:questions|string',
            'questions.*.options' => 'required_with:questions|array|min:2',
            'questions.*.options.*.text' => 'required_with:questions|string',
            'questions.*.options.*.is_correct' => 'required_with:questions|boolean',
        ];
    }
}
