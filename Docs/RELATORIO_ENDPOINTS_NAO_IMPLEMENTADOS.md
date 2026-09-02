# Relatório — Endpoints ainda não implementados no dashboard

> Fonte: `api_complete_docs.txt` (OpenAPI 3.1, C-Trip API v1.0.0) cruzado com o código em `lib/api/*` e `app/**`.
> Âmbito pedido: tags **`Administrator`** e **`Company Admin`**. Data: 2026-09-02.

## ✅ Estado da implementação — 2026-09-02

Todas as lacunas identificadas neste relatório foram fechadas (funções cliente + Server Actions + UI).
Verificado com `pnpm typecheck`, `pnpm lint`, `pnpm build` e `pnpm test` (tudo verde).

| Grupo | Endpoints | O que foi feito |
|---|---|---|
| Resumo financeiro | `GET /admin/payments/summary`, `GET /payments/company/summary` | `getAdminPaymentsSummary()` / `getCompanyPaymentsSummary()` + `<PaymentsSummaryCards>` em `/admin/pagamentos` e `/empresa/pagamentos`; overview do admin (`/admin`) passou a mostrar receita real + `<RevenueChart>` (por mês). |
| Aliases redundantes | `GET /admin/me/permissions`, `GET /companies/pending` | `getAdminMyPermissions()` / `getPendingCompaniesLegacy()` — wrappers marcados como redundantes (a UI já é servida por `/auth/my-permissions` e `/admin/companies/pending`). |
| Criação de frota | `POST /fleet/buses`, `POST /fleet/drivers` | Páginas `frota/autocarros/nova` e `frota/motoristas/novo` + formulários + `createBusAction` / `createDriverAction`; botão "Adicionar" nas listagens (gated por `bus:create` / `driver:create`). |
| Rotas | `PATCH /routes/{id}/activate`, `/deactivate`, `POST /routes/stops` | `<RouteRowActions>` (activar/desactivar com confirmação) na tabela de rotas + página de detalhe `rotas/[routeId]` com lista de paragens e `<AddRouteStopForm>`. |
| Horários | `PATCH /schedules/{id}` | Página `horarios/[scheduleId]` + `<EditScheduleForm>` (edição parcial) + ícone "Editar" nas acções de linha. |
| Tarefas de frota | `GET/POST/PATCH /fleet/tasks` | Feature nova: entrada "Tarefas" na navegação + página `frota/tarefas` com criação (gated por `task:create`) e mudança de estado por linha. |
| Roles da empresa | `GET /companies/roles`, `POST /companies/roles/assign`, `DELETE /companies/roles/{id}/users/{id}` | `<CollaboratorRoles>` na página de permissões do colaborador — lista roles atribuídas, atribui e remove; roles globais do sistema só aparecem se `flags.ENABLE_GLOBAL_ROLE_ASSIGNMENT`. |
| Roles globais (admin) | `POST /admin/roles/assign`, `GET /admin/users/{id}/roles`, `DELETE /admin/roles/{id}/users/{id}` | Página `admin/utilizadores/[userId]/roles` + `<UserRolesForm>`; coluna "Roles" na tabela de utilizadores. |

O detalhe abaixo é o levantamento original (antes destas alterações).

---

## Método e critérios

Cada endpoint da API foi classificado em três níveis:

| Nível | Significado |
|---|---|
| ✅ **Completo** | Existe função tipada em `lib/api/*` **e** é usada por uma página / Server Action. |
| 🟡 **Só cliente** | Existe a função em `lib/api/*`, mas **nenhuma página ou Server Action a chama** — não há UI. |
| ❌ **Em falta** | Não existe sequer função cliente em `lib/api/*`. |

"Ainda não implementado" = tudo o que **não** está ✅ (ou seja, 🟡 + ❌).

## Resumo

| Tag | Total endpoints | ✅ Completo (antes) | 🟡 Só cliente | ❌ Em falta | Não implementado (🟡+❌) |
|---|---:|---:|---:|---:|---:|
| Administrator | 21 | 15 | 3 | 3 | **6** → 0 |
| Company Admin | 28 | 16 | 12 | 0 | **12** → 0 |

_(Coluna "Não implementado" já reduzida a 0 — ver secção "Estado da implementação" acima.)_

---

## 1. Administrator — não implementado

### ❌ Sem qualquer implementação (nem cliente em `lib/api`)

| Método | Endpoint | Resumo (docs) | Observação |
|---|---|---|---|
| `GET` | `/admin/me/permissions` | Ver minhas permissões | Funcionalmente coberto por `/auth/my-permissions` (`getMyPermissions` em `lib/api/auth.ts`, usado por `lib/auth/session.ts`). O path específico de admin não tem wrapper próprio — provavelmente redundante. |
| `GET` | `/admin/payments/summary` | Resumo financeiro global (recebido / pendente / falhado / cancelado + quebra por dia e mês) | Não há função cliente nem uso. O overview do admin (`app/(dashboard)/admin/page.tsx`) só lista empresas pendentes; não há cards de receita nem gráfico financeiro. |
| `GET` | `/companies/pending` | [ADMIN] Listar empresas pendentes | Duplicado de `/admin/companies/pending` (esse está ✅ via `getPendingCompanies`). Este path alternativo não é usado. |

### 🟡 Cliente existe em `lib/api/admin.ts`, mas sem UI

| Método | Endpoint | Função cliente | O que falta |
|---|---|---|---|
| `POST` | `/admin/roles/assign` | `assignGlobalRole(userId, roleId)` | Nunca é chamada. Não há ecrã para atribuir uma role global a um utilizador. Em `app/(dashboard)/admin/utilizadores/page.tsx` a tabela de utilizadores não tem acções de linha. |
| `GET` | `/admin/users/{user_id}/roles` | `getUserRoles(userId)` | Nunca é chamada. Não há vista "roles deste utilizador". |
| `DELETE` | `/admin/roles/{role_id}/users/{user_id}` | `removeGlobalRoleUser(roleId, userId)` | Nunca é chamada. A página de edição de role (`admin/configuracoes/roles/[roleId]`) só edita permissões da role; não lista nem remove os utilizadores que a têm. |

> **Nota de produto:** as três lacunas acima formam um bloco coerente — *gestão de atribuição de roles globais a utilizadores*. Hoje o admin consegue criar/editar/apagar roles, mas não consegue ligá-las a pessoas pela UI.

### ✅ Administrator já completo (referência)

`GET /admin/companies/pending` · `GET /admin/companies` · `POST /admin/companies/actions/approve` · `POST /admin/companies/actions/reject` · `POST /admin/companies/actions/suspend` · `GET /admin/payments` · `POST /payments/actions/confirm` · `GET /admin/users` · `GET /admin/audit-log` · `GET /admin/permissions` · `GET /admin/roles` · `POST /admin/roles` · `GET /admin/roles/{role_id}` · `DELETE /admin/roles/{role_id}` · `PATCH /admin/roles/{role_id}/permissions`

---

## 2. Company Admin — não implementado

> Não há nenhum endpoint **❌ em falta**: todos os 28 têm função tipada em `lib/api/*`. As lacunas são todas de **camada de UI** (🟡).

### 🟡 Cliente existe, mas sem UI

| Método | Endpoint | Função cliente (ficheiro) | O que falta |
|---|---|---|---|
| `POST` | `/routes/stops` | `addRouteStop` (`routes.ts`) | O formulário de nova rota (`empresa/rotas/nova`) só cria a rota base (origem, destino, preço). Não há UI para adicionar paragens intermédias nem página de detalhe da rota. |
| `PATCH` | `/routes/{route_id}/activate` | `setRouteActive(id, true)` (`routes.ts`) | A tabela de rotas (`empresa/rotas/page.tsx`) só mostra o estado (Activa/Inactiva) — não tem acções de linha. |
| `PATCH` | `/routes/{route_id}/deactivate` | `setRouteActive(id, false)` (`routes.ts`) | Idem — nunca é chamada. |
| `PATCH` | `/schedules/{schedule_id}` | `updateSchedule` (`schedules.ts`) | `schedule-row-actions.tsx` só tem a acção "Cancelar". Não há edição de viagem (mudar autocarro, motorista, data/hora, lugares, corte de embarque). |
| `POST` | `/fleet/buses` | `createBus` (`fleet.ts`) | Não existe página `empresa/frota/autocarros/novo` nem formulário de criação. A lista só permite mudar o estado de autocarros já existentes. |
| `POST` | `/fleet/drivers` | `createDriver` (`fleet.ts`) | Não existe página `empresa/frota/motoristas/novo` nem formulário. A lista só permite alternar a disponibilidade. |
| `GET` | `/fleet/tasks` | `getMyTasks` (`fleet.ts`) | Não existe secção de Tarefas na app (nem entrada na navegação `config/nav.ts`). |
| `POST` | `/fleet/tasks` | `createTask` (`fleet.ts`) | Sem UI. |
| `PATCH` | `/fleet/tasks/{task_id}` | `updateTaskStatus` (`fleet.ts`) | Sem UI. |
| `GET` | `/companies/roles` | `getCompanyRoles` (`companies.ts`) | Não há página de gestão de roles da empresa para o gestor; `config/nav.ts` (`empresaNav`) não tem entrada "Roles". |
| `POST` | `/companies/roles/assign` | `assignCompanyRole(userId, roleId)` (`companies.ts`) | A página de permissões do colaborador (`empresa/colaboradores/[userId]/permissoes`) só usa `replaceCollaboratorPermissions` (permissões soltas). Nunca atribui uma role. |
| `DELETE` | `/companies/roles/{role_id}/users/{user_id}` | `removeCompanyRole(roleId, userId)` (`companies.ts`) | Sem UI. |

> **Notas de produto:**
> - **Frota bloqueada na criação:** o guia diz "sem autocarro/motorista não há horário", mas hoje **não há forma de criar autocarros nem motoristas pela UI** (`createBus`/`createDriver` só existem como wrapper). O formulário de novo horário (`empresa/horarios/novo`) depende de `getBuses`/`getDrivers` que virão sempre vazios.
> - **Rotas são "write-once":** depois de criada, uma rota não pode ser activada/desactivada nem receber paragens pela UI.
> - **Tarefas:** feature inteira (3 endpoints) sem qualquer superfície na app.
> - **Roles da empresa:** o gestor só consegue dar permissões soltas, nunca roles — parcialmente intencional (`config/flags.ts: ENABLE_GLOBAL_ROLE_ASSIGNMENT = false`), mas as roles *custom da empresa* também não são geríveis.

### ✅ Company Admin já completo (referência)

`GET /companies/permissions` · `PATCH /companies/profile` · `GET /companies/users` · `POST /companies/users` · `DELETE /companies/users/{user_id}` · `POST /companies/users/{user_id}/permissions` · `GET /companies/users/{user_id}/roles` · `GET /fleet/buses` · `PATCH /fleet/buses/{bus_id}` · `GET /fleet/drivers` · `PATCH /fleet/drivers/{driver_id}` · `POST /routes/` · `GET /routes/company` · `POST /schedules/` · `POST /schedules/actions/cancel` · `GET /schedules/company`

---

## 3. Apêndice — inventário completo

### Administrator (21)

| Estado | Método | Endpoint | Cliente `lib/api` | UI |
|---|---|---|---|---|
| ✅ | GET | /admin/companies/pending | `getPendingCompanies` | `admin/page.tsx`, `admin/empresas/page.tsx` |
| ✅ | GET | /admin/companies | `getAllCompanies` | `admin/empresas/page.tsx`, `[companyId]` |
| ✅ | POST | /admin/companies/actions/approve | `moderateCompany` | `admin/empresas/actions.ts` |
| ✅ | POST | /admin/companies/actions/reject | `moderateCompany` | `admin/empresas/actions.ts` |
| ✅ | POST | /admin/companies/actions/suspend | `moderateCompany` | `admin/empresas/actions.ts` |
| ✅ | GET | /admin/payments | `getAllPayments` | `admin/pagamentos/page.tsx` |
| ✅ | POST | /payments/actions/confirm | `confirmPaymentManually` | `admin/pagamentos/actions.ts` |
| ✅ | GET | /admin/users | `getAllUsers` | `admin/utilizadores/page.tsx` |
| ✅ | GET | /admin/audit-log | `getAuditLog` | `admin/auditoria/page.tsx` |
| ✅ | GET | /admin/permissions | `getAllPermissions` | `admin/configuracoes/roles/nova` + `[roleId]` |
| ✅ | GET | /admin/roles | `getGlobalRoles` | `admin/configuracoes/roles/page.tsx` |
| ✅ | POST | /admin/roles | `createGlobalRole` | `admin/configuracoes/roles/actions.ts` |
| ✅ | GET | /admin/roles/{role_id} | `getGlobalRole` | `admin/configuracoes/roles/[roleId]/page.tsx` |
| ✅ | DELETE | /admin/roles/{role_id} | `deleteGlobalRole` | `admin/configuracoes/roles/actions.ts` |
| ✅ | PATCH | /admin/roles/{role_id}/permissions | `updateGlobalRolePermissions` | `admin/configuracoes/roles/actions.ts` |
| 🟡 | POST | /admin/roles/assign | `assignGlobalRole` | — |
| 🟡 | GET | /admin/users/{user_id}/roles | `getUserRoles` | — |
| 🟡 | DELETE | /admin/roles/{role_id}/users/{user_id} | `removeGlobalRoleUser` | — |
| ❌ | GET | /admin/me/permissions | — | — |
| ❌ | GET | /admin/payments/summary | — | — |
| ❌ | GET | /companies/pending | — | — |

### Company Admin (28)

| Estado | Método | Endpoint | Cliente `lib/api` | UI |
|---|---|---|---|---|
| ✅ | GET | /companies/users | `getCompanyUsers` | `empresa/colaboradores/page.tsx` |
| ✅ | POST | /companies/users | `createCollaborator` | `empresa/colaboradores/actions.ts` |
| ✅ | DELETE | /companies/users/{user_id} | `removeCollaborator` | `empresa/colaboradores/actions.ts` |
| ✅ | GET | /companies/permissions | `getAssignableCompanyPermissions` | `.../permissoes/page.tsx` |
| ✅ | POST | /companies/users/{user_id}/permissions | `replaceCollaboratorPermissions` | `.../permissoes/actions.ts` |
| ✅ | GET | /companies/users/{user_id}/roles | `getCollaboratorRoles` | `.../permissoes/page.tsx` |
| ✅ | PATCH | /companies/profile | `updateCompanyProfile` | `empresa/perfil/actions.ts` |
| ✅ | GET | /routes/company | `getCompanyRoutes` | `empresa/rotas/page.tsx`, `horarios/novo` |
| ✅ | POST | /routes/ | `createRoute` | `empresa/rotas/actions.ts` |
| ✅ | GET | /schedules/company | `getCompanySchedules` | `empresa/horarios/page.tsx` |
| ✅ | POST | /schedules/ | `createSchedule` | `empresa/horarios/actions.ts` |
| ✅ | POST | /schedules/actions/cancel | `cancelSchedule` | `empresa/horarios/actions.ts` |
| ✅ | GET | /fleet/buses | `getBuses` | `empresa/frota/autocarros/page.tsx`, `horarios/novo` |
| ✅ | PATCH | /fleet/buses/{bus_id} | `updateBus` | `empresa/frota/autocarros/actions.ts` |
| ✅ | GET | /fleet/drivers | `getDrivers` | `empresa/frota/motoristas/page.tsx`, `horarios/novo` |
| ✅ | PATCH | /fleet/drivers/{driver_id} | `updateDriver` | `empresa/frota/motoristas/actions.ts` |
| 🟡 | POST | /routes/stops | `addRouteStop` | — |
| 🟡 | PATCH | /routes/{route_id}/activate | `setRouteActive` | — |
| 🟡 | PATCH | /routes/{route_id}/deactivate | `setRouteActive` | — |
| 🟡 | PATCH | /schedules/{schedule_id} | `updateSchedule` | — |
| 🟡 | POST | /fleet/buses | `createBus` | — |
| 🟡 | POST | /fleet/drivers | `createDriver` | — |
| 🟡 | GET | /fleet/tasks | `getMyTasks` | — |
| 🟡 | POST | /fleet/tasks | `createTask` | — |
| 🟡 | PATCH | /fleet/tasks/{task_id} | `updateTaskStatus` | — |
| 🟡 | GET | /companies/roles | `getCompanyRoles` | — |
| 🟡 | POST | /companies/roles/assign | `assignCompanyRole` | — |
| 🟡 | DELETE | /companies/roles/{role_id}/users/{user_id} | `removeCompanyRole` | — |

---

## 4. Prioridade sugerida (só as lacunas)

1. **`POST /fleet/buses` + `POST /fleet/drivers`** — bloqueiam a criação de horários; hoje não há caminho na UI.
2. **`PATCH /routes/*/activate` / `deactivate`** — acção de linha simples na tabela de rotas.
3. **`PATCH /schedules/{schedule_id}`** — editar viagem (só existe cancelar).
4. **`GET /admin/payments/summary` + `GET /payments/company/summary`** *(este último é tag Passenger/COMPANY)* — dashboards financeiros de admin e gestor.
5. **`POST /routes/stops`** + página de detalhe da rota.
6. **Atribuição de roles** (admin: `/admin/roles/assign`, `/admin/users/{id}/roles`, `DELETE .../users/{id}`; empresa: `/companies/roles`, `/companies/roles/assign`, `DELETE`).
7. **Tarefas de frota** (`/fleet/tasks` ×3) — feature nova completa.
