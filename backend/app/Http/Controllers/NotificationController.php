<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Helpers\ApiController;
use App\Models\Notification;

class NotificationController extends ApiController
{
    public function __construct(Notification $model)
    {
        $this->anonymous = ['lookup'];
        parent::__construct($model);
    }
}