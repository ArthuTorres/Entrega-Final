<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Helpers\ApiController;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MessageController extends ApiController
{
    public function __construct(Message $model)
    {
        $this->anonymous = ['lookup'];
        parent::__construct($model);
    }

    public function getChats(Request $r)
    {
        $userId = auth()->user()->id;

        // Subquery para obter a última mensagem de cada par de contatos
        $subquery = DB::table('messages')
            ->select(DB::raw("LEAST(from_id, to_id) as user1, 
                      GREATEST(from_id, to_id) as user2, 
                      MAX(id) as max_id"))
            ->where('from_id', $userId)
            ->orWhere('to_id', $userId)
            ->groupBy('user1', 'user2');

        // Query principal para obter os detalhes das últimas mensagens e os nomes dos usuários
        $messages = DB::table('messages')
            ->joinSub($subquery, 'subquery', function ($join) {
                $join->on('messages.id', '=', 'subquery.max_id');
            })
            ->select(
                DB::raw("CASE 
                    WHEN messages.from_id = $userId THEN messages.to_id 
                    ELSE messages.from_id 
                 END as contact_id"),
                'messages.message as last_message',
                'messages.created_at as last_message_date',
                'messages.from_id as last_message_from_id',
                'users.name as contact_name'
            )
            ->join('users', 'users.id', '=', DB::raw("CASE 
                                                    WHEN messages.from_id = $userId THEN messages.to_id 
                                                    ELSE messages.from_id 
                                                 END"))
            ->orderBy('last_message_date', 'desc')
            ->get();

        return response()->json($messages);
    }

    public function getChat(Request $r, $contactId)
    {
        $userId = auth()->user()->id;

        $messages = Message::where(function ($query) use ($userId, $contactId) {
            $query->where('from_id', $userId)
                ->where('to_id', $contactId);
        })
            ->orWhere(function ($query) use ($userId, $contactId) {
                $query->where('from_id', $contactId)
                    ->where('to_id', $userId);
            })
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($messages);
    }
}
