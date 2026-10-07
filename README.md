## Table `apartamento`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id_apartamento` | `int4` | Primary Identity |
| `id_bloco` | `int4` |  Nullable |
| `id_dono` | `int4` |  Nullable |
| `id_inquilino` | `int4` |  Nullable |
| `numero` | `int4` |  Nullable |

## Table `avisos`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id_avisos` | `int4` | Primary Identity |
| `assunto` | `varchar` |  Nullable |
| `data` | `date` |  Nullable |
| `id_sindico` | `int4` |  Nullable |
| `texto` | `varchar` |  Nullable |

## Table `bloco`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id_bloco` | `int4` | Primary Identity |
| `nome` | `varchar` |  Nullable |

## Table `chamado`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id_chamado` | `int4` | Primary Identity |
| `assunto` | `varchar` |  Nullable |
| `data_abertura` | `timestamp` |  Nullable |
| `descricao` | `varchar` |  Nullable |
| `status` | `varchar` |  Nullable |

## Table `dono`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id_dono` | `int4` | Primary Identity |
| `cpf` | `varchar` |  Nullable |
| `data_nascimento` | `date` |  Nullable |
| `foto` | `text` |  Nullable |
| `nome` | `varchar` |  Nullable |
| `senha` | `varchar` |  Nullable |

## Table `encomenda`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id_encomenda` | `int4` | Primary Identity |
| `data_recebimento` | `timestamp` |  Nullable |
| `id_apartamento` | `int4` |  Nullable |
| `id_dono` | `int4` |  Nullable |
| `id_inquilino` | `int4` |  Nullable |
| `status` | `varchar` |  Nullable |

## Table `enquete`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id_enquete` | `int4` | Primary Identity |
| `assunto` | `varchar` |  Nullable |
| `data` | `date` |  Nullable |
| `id_sindico` | `int4` |  Nullable |
| `op_1` | `int4` |  Nullable |
| `op_2` | `int4` |  Nullable |
| `op_3` | `int4` |  Nullable |
| `op_4` | `int4` |  Nullable |
| `texto_op1` | `varchar` |  Nullable |
| `texto_op2` | `varchar` |  Nullable |
| `texto_op3` | `varchar` |  Nullable |
| `texto_op4` | `varchar` |  Nullable |

## Table `funcionario`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id_funcionario` | `int4` | Primary Identity |
| `cpf` | `varchar` |  Nullable |
| `data_nascimento` | `date` |  Nullable |
| `foto` | `text` |  Nullable |
| `funcao` | `varchar` |  Nullable |
| `nome` | `varchar` |  Nullable |
| `senha` | `varchar` |  Nullable |

## Table `inquilino`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id_inquilino` | `int4` | Primary Identity |
| `cpf` | `varchar` |  Nullable |
| `data_nascimento` | `date` |  Nullable |
| `foto` | `text` |  Nullable |
| `nome` | `varchar` |  Nullable |
| `proprietario_bool` | `bool` |  Nullable |
| `senha` | `varchar` |  Nullable |

## Table `log_acao`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id_log` | `int4` | Primary Identity |
| `autor` | `varchar` |  Nullable |
| `data_acao` | `timestamp` |  Nullable |
| `descricao` | `varchar` |  Nullable |

## Table `mensagem`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id_mensagem` | `int4` | Primary Identity |
| `data_envio` | `timestamp` |  Nullable |
| `nome_remetente` | `varchar` |  Nullable |
| `texto` | `varchar` |  Nullable |
| `tipo_remetente` | `varchar` |  Nullable |

## Table `reserva`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id_reserva` | `int4` | Primary Identity |
| `data_prevista` | `date` |  Nullable |
| `id_inquilino` | `int4` |  Nullable |
| `id_salao` | `int4` |  Nullable |
| `status` | `varchar` |  Nullable |

## Table `salao`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id_salao` | `int4` | Primary Identity |
| `nome` | `varchar` |  Nullable |
| `status` | `varchar` |  Nullable |

## Table `sindico`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id_sindico` | `int4` | Primary Identity |
| `cpf` | `varchar` |  Nullable |
| `data_final_posse` | `date` |  Nullable |
| `data_posse` | `date` |  Nullable |
| `foto` | `text` |  Nullable |
| `nome` | `varchar` |  Nullable |
| `senha` | `varchar` |  Nullable |
| `status` | `varchar` |  Nullable |

## Table `tarefa`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id_tarefa` | `int4` | Primary Identity |
| `data_criacao` | `timestamp` |  Nullable |
| `id_chamado` | `int4` |  Nullable |
| `id_funcionario` | `int4` |  Nullable |
| `status` | `varchar` |  Nullable |

## Table `visitante`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id_visitante` | `int4` | Primary Identity |
| `cpf` | `varchar` |  Nullable |
| `id_dono` | `int4` |  Nullable |
| `id_inquilino` | `int4` |  Nullable |
| `nome` | `varchar` |  Nullable |
| `prestador_bool` | `bool` |  Nullable |
| `status` | `varchar` |  Nullable |

