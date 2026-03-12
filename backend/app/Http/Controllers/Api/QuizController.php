<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Option;
use App\Models\Quiz;
use App\Models\Result;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class QuizController extends Controller
{
    public function index()
    {
        return Quiz::with('creator')->latest()->paginate(10);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'questions' => 'required|array|min:1',
            'questions.*.text' => 'required|string',
            'questions.*.options' => 'required|array|min:2',
            'questions.*.options.*.text' => 'required|string',
            'questions.*.options.*.is_correct' => 'required|boolean',
        ]);

        return DB::transaction(function () use ($request) {
            $quiz = $request->user()->quizzes()->create([
                'title' => $request->title,
                'description' => $request->description,
            ]);

            foreach ($request->questions as $qData) {
                $question = $quiz->questions()->create([
                    'text' => $qData['text'],
                ]);

                foreach ($qData['options'] as $oData) {
                    $question->options()->create([
                        'text' => $oData['text'],
                        'is_correct' => $oData['is_correct'],
                    ]);
                }
            }

            return $quiz->load('questions.options');
        });
    }

    public function show(Quiz $quiz)
    {
        $quiz->load(['creator', 'questions.options']);

        // Hide correct answers if not the creator
        if (auth()->id() !== $quiz->created_by) {
            $quiz->questions->each(function ($question) {
                $question->options->makeHidden('is_correct');
            });
        }

        return $quiz;
    }

    public function submit(Request $request, Quiz $quiz)
    {
        $request->validate([
            'answers' => 'required|array', // [question_id => option_id]
        ]);

        $score = 0;
        $totalQuestions = $quiz->questions()->count();

        // Load correct answers for validation
        $correctOptions = Option::whereIn('question_id', $quiz->questions()->pluck('id'))
            ->where('is_correct', true)
            ->get()
            ->keyBy('question_id');

        foreach ($request->answers as $questionId => $optionId) {
            if (isset($correctOptions[$questionId]) && $correctOptions[$questionId]->id == $optionId) {
                $score++;
            }
        }

        // Calculate percentage or raw score? Let's do raw score for now.
        $result = Result::create([
            'user_id' => auth()->id(),
            'quiz_id' => $quiz->id,
            'score' => $score,
        ]);

        return response()->json([
            'message' => 'Quiz submitted successfully',
            'score' => $score,
            'total' => $totalQuestions,
            'result_id' => $result->id,
        ]);
    }

    public function update(Request $request, Quiz $quiz)
    {
        // For brevity, not implementing full update logic yet (complex with nested relations)
        return response()->json(['message' => 'Update not implemented yet'], 501);
    }

    public function destroy(Request $request, Quiz $quiz)
    {
        if ($request->user()->id !== $quiz->created_by) {
            abort(403);
        }
        
        $quiz->delete();
        return response()->noContent();
    }
}
