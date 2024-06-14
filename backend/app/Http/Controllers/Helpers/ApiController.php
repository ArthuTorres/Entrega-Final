<?php

namespace App\Http\Controllers\Helpers;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Builder;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class ApiController extends Controller
{
    protected $model;
    protected $modelName;
    protected $anonymous = ['lookup'];

    public function __construct(Model $modelo)
    {
        $this->model = $modelo;
        $this->modelName = get_class($modelo);
        $this->middleware('auth:api', ['except' => $this->anonymous]);
    }

    public function get_query(Request $request)
    {
        $query = $this->model::query();

        $filter_enc = $request->input('filter', null);
        if ($filter_enc != null) {
            $filter = json_decode(base64_decode($filter_enc), true);
            $this->applyFilter($query, $filter);
        }

        return $this->apply_includes($request, $query);
    }

    public function apply_includes(Request $request, $query)
    {
        return $query->with($this->model->with_includes());
    }

    public function index(Request $request)
    {
        $data = $this->get_query($request);

        if ($request->has("page")) {
            $page = $request->input("page", 1);
            $pagesize = $request->input("pagesize", 10);

            $result = $data->paginate($pagesize, ["*"], "page", $page);
            if ($result->currentPage() > $result->lastPage()) {
                $result = $data->paginate($pagesize, ["*"], "page", 1);
            }

            return response()->json($result);
        }

        return response()->json($data->get());
    }

    public function lookup(Request $request)
    {
        $queryResult = $this->get_query($request)->get();
        $lookup = $queryResult->map(function ($item) {
            return ["value" => $item->id, "display" => $item->__toString()];
        });

        return response()->json($lookup);
    }

    public function show(Request $request, $id)
    {
        $recurso = $this->get_query($request)->find($id);

        if (!$recurso) {
            return response()->json(['mensagem' => 'Recurso não encontrado'], 404);
        }

        return response()->json($recurso);
    }

    public function store(Request $request): JsonResponse
    {
        try {
            DB::beginTransaction();
            $this->validateInput($request);

            $resource = new ($this->modelName)();
            $this->saveResource($resource, $request);

            DB::commit();
            return response()->json($resource, 201);
        } catch (Exception $e) {
            DB::rollback();
            return response()->json(['erro' => 'Erro ao salvar itens. Detalhes: ' . $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            DB::beginTransaction();
            $resource = $this->get_query($request)->find($id);

            if (!$resource) {
                return response()->json(['mensagem' => 'Recurso não encontrado'], 404);
            }

            $this->validateInput($request);
            $this->saveResource($resource, $request);

            DB::commit();
            return response()->json($resource);
        } catch (Exception $e) {
            DB::rollback();
            return response()->json(['erro' => 'Erro ao salvar itens. Detalhes: ' . $e->getMessage()], 500);
        }
    }

    public function destroy(Request $request, $id)
    {
        try {
            DB::beginTransaction();
            $recurso = $this->get_query($request)->find($id);

            if (!$recurso) {
                return response()->json(['mensagem' => 'Recurso não encontrado'], 404);
            }

            $recurso->delete();
            DB::commit();
            return response()->json(['mensagem' => 'Recurso removido com sucesso']);
        } catch (Exception $e) {
            DB::rollback();
            return response()->json(['erro' => 'Erro ao salvar itens. Detalhes: ' . $e->getMessage()], 500);
        }
    }

    public function bulk(Request $request)
    {
        try {
            DB::beginTransaction();
            $errors = [];
            $response = [];

            foreach ($request->all() as $key => $item) {
                $validator = Validator::make($item, $this->model->getRules());
                if ($validator->fails()) {
                    $errors[] = [
                        "dados" => $item,
                        "errors" => $validator->errors()->toArray(),
                    ];
                }
            }

            if (!empty($errors))
                return response()->json(['erros' => $errors], 400);

            foreach ($request->all() as $key => $item) {
                if (isset($item['id']) && $item['id'] > 0) {
                    $recurso = $this->model->find($item['id']);

                    if ($recurso) {
                        $recurso->beforeSave();
                        $recurso->fill($item);
                        $recurso->save();
                        $recurso->afterSave();
                        $response[] = $recurso;
                    }
                } else {
                    $response[] = $this->model->create($item);
                }
            }

            DB::commit();
            return response()->json($response);
        } catch (Exception $e) {
            DB::rollback();
            return response()->json(['erro' => 'Erro ao salvar itens. Detalhes: ' . $e->getMessage()], 500);
        }
    }

    protected function onSaving($resource, Request $request)
    {
    }
    protected function onResourceSaving($resource, Request $request)
    {
    }
    protected function onResourceSaved($resource, Request $request)
    {
    }
    protected function onChildrenSaving($resource, Request $request)
    {
    }
    protected function onChildrenSaved($resource, Request $request)
    {
    }
    protected function onSaved($resource, Request $request)
    {
        $resource->afterSave();
    }

    private function applyFilter(Builder $query, $filter, $parent = null)
    {
        if (isset($filter['and'])) {
            $query->where(function ($query) use ($filter) {
                foreach ($filter['and'] as $condition) {
                    $this->applyFilter($query, $condition, 'and');
                }
            });
        } elseif (isset($filter['or'])) {
            $query->where(function ($query) use ($filter) {
                foreach ($filter['or'] as $condition) {
                    $this->applyFilter($query, $condition, 'or');
                }
            });
        } else {
            foreach ($filter as $operator => $conditions) {
                foreach ($conditions as $field => $value) {
                    if (strpos($field, '.') !== false) {
                        [$relation, $field] = explode('.', $field);
                        if ($parent !== null) {
                            $query->whereHas($relation, function ($query) use ($field, $operator, $value) {
                                $this->applyFilter($query, [$operator => [$field => $value]]);
                            });
                        }
                    } else {
                        if ($operator === 'isnull') {
                            if ($value)
                                $query->{$parent == 'or' ? 'orWhereNull' : 'whereNull'}($field);
                            else
                                $query->{$parent == 'or' ? 'orWhereNotNull' : 'whereNotNull'}($field);
                        } elseif ($operator === 'in') {
                            $query->whereIn($field, $value);
                            $query->{$parent == 'or' ? 'orWhereIn' : 'whereIn'}($field, $value);
                        } elseif ($operator === 'between') {
                            $query->{$parent == 'or' ? 'orWhereBetween' : 'whereBetween'}($field, $value);
                        } else {
                            $query->{$parent == 'or' ? 'orWhere' : 'where'}($field, $operator, $value);
                        }
                    }
                }
            }
        }
    }

    protected function validateInput(Request $request)
    {
        $validator = Validator::make($request->all(), $this->model->getRules());
        if ($validator->fails()) {
            return response()->json(['erros' => $validator->errors()], 400);
        }
    }

    protected function saveResource($resource, Request $request)
    {
        $this->onSaving($resource, $request);

        $this->onResourceSaving($resource, $request);
        $resource->fill($request->all());
        $resource->save();
        $resource = $this->get_query($request)->find($resource->id);
        $this->onResourceSaved($resource, $request);

        $this->onChildrenSaving($resource, $request);
        $this->saveChildren($resource, $request);
        $this->onChildrenSaved($resource, $request);

        $this->onSaved($resource, $request);
    }

    # Deixar funcionamento mais esperto
    protected function saveChildren($resource, Request $request)
    {
        foreach ($request->all() as $key => $value) {
            if (in_array($key, $resource->hasOne)) {
                $resource->{$key}()->create($value);
            } else if (in_array($key, $resource->hasMany)) {
                $resource->{$key}()->createMany($value);
            }
        }
    }
}
