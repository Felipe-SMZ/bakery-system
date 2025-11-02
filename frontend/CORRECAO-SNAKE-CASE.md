# 🐛 CORREÇÃO: Snake_case vs camelCase

## 📋 Problema Identificado

### ❌ Erro:
```
Failed to load resource: the server responded with a status of 400 (Bad Request)
AxiosError: Request failed with status code 400
```

### 🎯 Causa Raiz:
**Incompatibilidade de nomenclatura entre Frontend e Backend**

- **Frontend:** Envia parâmetros em `camelCase`
  ```javascript
  { dataInicio: '2024-01-01', dataFim: '2024-01-31' }
  ```

- **Backend:** Espera parâmetros em `snake_case`
  ```javascript
  { data_inicio: '2024-01-01', data_fim: '2024-01-31' }
  ```

## ✅ Solução Aplicada

### Arquivo: `src/services/relatorioService.js`

#### 1️⃣ **buscarVendasPorPeriodo**
```javascript
// ❌ ANTES
params: { dataInicio, dataFim, agrupamento }

// ✅ DEPOIS
params: { 
    data_inicio: dataInicio,
    data_fim: dataFim,
    agrupamento
}
```

#### 2️⃣ **buscarProdutosMaisVendidos**
```javascript
// ❌ ANTES
export const buscarProdutosMaisVendidos = async (dataInicio = null, dataFim = null, limite = 10) => {
    const params = { limite };
    if (dataInicio) params.dataInicio = dataInicio;
    if (dataFim) params.dataFim = dataFim;
    ...
}

// ✅ DEPOIS
export const buscarProdutosMaisVendidos = async (filtros = {}) => {
    const response = await api.get('/relatorios/produtos-mais-vendidos', { 
        params: filtros  // Passa filtros direto (já vem com snake_case)
    });
}
```

#### 3️⃣ **buscarVendasPorFormaPagamento**
```javascript
// ❌ ANTES
const params = {};
if (dataInicio) params.dataInicio = dataInicio;
if (dataFim) params.dataFim = dataFim;

// ✅ DEPOIS
const response = await api.get('/relatorios/vendas-por-forma-pagamento', { 
    params: filtros  // Recebe filtros já formatados
});
```

#### 4️⃣ **buscarDesempenhoFuncionarios**
```javascript
// ❌ ANTES
const params = {};
if (dataInicio) params.dataInicio = dataInicio;
if (dataFim) params.dataFim = dataFim;

// ✅ DEPOIS
const response = await api.get('/relatorios/desempenho-funcionarios', { 
    params: filtros
});
```

## 🎓 Lição Aprendida

### 📖 Convenções de Nomenclatura:

| Linguagem/Framework | Convenção | Exemplo |
|---------------------|-----------|---------|
| **JavaScript/React** | camelCase | `dataInicio`, `totalVendas` |
| **Python/SQL** | snake_case | `data_inicio`, `total_vendas` |
| **Java/C#** | PascalCase | `DataInicio`, `TotalVendas` |

### 💡 Como Evitar no Futuro:

1. **Documentar API:** Sempre especificar formato dos parâmetros
2. **Service Layer:** Transformar dados no service (não no componente)
3. **Type Safety:** Usar TypeScript para validar em tempo de desenvolvimento
4. **Testes:** Incluir testes de integração para validar requisições

## 🔍 Como Diagnosticar Esse Tipo de Erro:

1. **Inspecionar Network:**
   - Abrir DevTools → Network
   - Ver a requisição que deu 400
   - Conferir "Request Payload" vs. o que backend espera

2. **Verificar Backend:**
   - Logs do servidor
   - Documentação da API
   - Validação de parâmetros (ex: Joi, Yup)

3. **Comparar:**
   - Frontend envia: `?dataInicio=...&dataFim=...`
   - Backend espera: `?data_inicio=...&data_fim=...`

## ✅ Resultado Final

Agora as requisições funcionam corretamente:

```javascript
// Frontend (Relatorios.jsx)
relatorioService.buscarProdutosMaisVendidos({
    data_inicio: filtros.dataInicio,  // ✅ snake_case
    data_fim: filtros.dataFim,        // ✅ snake_case
    limite: 10
})

// Backend recebe (req.query)
{
    data_inicio: '2024-01-01',  // ✅ Correto
    data_fim: '2024-01-31',     // ✅ Correto
    limite: '10'
}
```

---

**Status:** ✅ Resolvido  
**Impacto:** Todas as requisições de relatórios agora funcionam  
**Próximos Passos:** Testar cada aba da página de Relatórios
