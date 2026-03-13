<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreQuizRequest;
use App\Http\Requests\UpdateQuizRequest;
use App\Http\Resources\QuizResource;
use App\Models\Option;
use App\Models\Quiz;
use App\Models\Result;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class QuizController extends Controller
{
    public function index()
    {
        return QuizResource::collection(
            Quiz::with('creator')->latest()->paginate(10)
        );
    }

    public function store(StoreQuizRequest $request)
    {
        $quiz = DB::transaction(function () use ($request) {
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

            return $quiz;
        });

        return new QuizResource($quiz->load(['questions.options', 'questions.quiz']));
    }

    public function show(Quiz $quiz)
    {
        // Load relationships needed for resources and policy checks
        $quiz->load(['creator', 'questions.options', 'questions.quiz']);
        
        return new QuizResource($quiz);
    }

    public function update(UpdateQuizRequest $request, Quiz $quiz)
    {
        $quiz = DB::transaction(function () use ($request, $quiz) {
            $quiz->update([
                'title' => $request->title,
                'description' => $request->description,
            ]);

            // If questions are provided, replace them entirely (simplest strategy for this app)
            if ($request->has('questions')) {
                // Delete old questions (and cascading options)
                $quiz->questions()->delete();

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
            }

            return $quiz;
        });

        return new QuizResource($quiz->load(['questions.options', 'questions.quiz']));
    }

    public function destroy(Request $request, Quiz $quiz)
    {
        if ($request->user()->id !== $quiz->created_by) {
            abort(403);
        }
        
        $quiz->delete();
        return response()->noContent();
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
}
