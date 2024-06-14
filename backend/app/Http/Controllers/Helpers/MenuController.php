<?php

namespace App\Http\Controllers\Helpers;

use App\Http\Controllers\Controller;

class MenuController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function getMenu()
    {
        $userProfile = auth()->user()->profile;
        $menu = config('menu.items');

        switch ($userProfile) {
            case 'gerencia':
                break;
            case 'operacional':
                $menus = ["cotacoes"];
                $submenus = ["cotacoes"];

                foreach ($menu as &$menuItem) {
                    $menuItem["items"] = array_filter($menuItem["items"], function ($submenu) use ($submenus) {
                        return in_array($submenu['id'], $submenus);
                    });
                }

                $menu = array_filter($menu, function ($menuItem) use ($menus) {
                    return in_array($menuItem['id'], $menus) && count($menuItem["items"]) > 0;
                });
                break;
            case 'formulador':
                $menus = ["cotacoes", "cadastros"];
                $submenus = ["cotacoes", "clientes"];

                foreach ($menu as &$menuItem) {
                    $menuItem["items"] = array_filter($menuItem["items"], function ($submenu) use ($submenus) {
                        return in_array($submenu['id'], $submenus);
                    });
                }

                $menu = array_filter($menu, function ($menuItem) use ($menus) {
                    return in_array($menuItem['id'], $menus) && count($menuItem["items"]) > 0;
                });
                break;
        }

        return response()->json($menu);
    }
}
