CREATE TABLE IF NOT EXISTS pacientes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    nome varchar(150) NOT NULL,
    data_nascimento date NOT NULL,
    cpf char(11) NOT NULL UNIQUE,
    status_atendimento varchar(15) DEFAULT 'AGUARDANDO' CHECK (status_atendimento IN ('AGUARDANDO', 'EM_ATENDIMENTO', 'FINALIZADO')),
    gravidade varchar(10) DEFAULT 'BAIXA' CHECK (gravidade IN ('BAIXA', 'MEDIA', 'ALTA')),
    criado_em timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS exames (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    paciente_id uuid NOT NULL,
    tipo_exame varchar(100) NOT NULL,
    resultados jsonb NOT NULL,
    observacoes_clinicas text,
    realizado_em timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_paciente FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE
);