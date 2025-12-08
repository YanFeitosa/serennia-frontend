// src/lib/errorMessages.ts
// Mensagens de erro amigáveis para o usuário final

export const ERROR_MESSAGES = {
  // Autenticação
  LOGIN_FAILED: 'Não foi possível realizar o login. Verifique seu e-mail e senha.',
  SESSION_EXPIRED: 'Sua sessão expirou. Por favor, faça login novamente.',
  USER_DATA_FAILED: 'Erro ao carregar seus dados. Por favor, faça login novamente.',
  PASSWORD_CHANGE_FAILED: 'Não foi possível alterar a senha. Verifique se a senha atual está correta.',
  FORGOT_PASSWORD_FAILED: 'Não foi possível enviar o e-mail de recuperação. Verifique o endereço e tente novamente.',
  
  // Registro
  REGISTRATION_FAILED: 'Não foi possível criar sua conta. Verifique os dados e tente novamente.',
  
  // Carregamento de dados
  LOAD_SALONS_FAILED: 'Não foi possível carregar os salões. Tente novamente em alguns instantes.',
  SELECT_SALON_FAILED: 'Não foi possível selecionar o salão. Tente novamente.',
  LOAD_CLIENTS_FAILED: 'Não foi possível carregar os clientes. Tente novamente.',
  LOAD_SERVICES_FAILED: 'Não foi possível carregar os serviços. Tente novamente.',
  LOAD_PRODUCTS_FAILED: 'Não foi possível carregar os produtos. Tente novamente.',
  LOAD_COLLABORATORS_FAILED: 'Não foi possível carregar os colaboradores. Tente novamente.',
  LOAD_APPOINTMENTS_FAILED: 'Não foi possível carregar os agendamentos. Tente novamente.',
  LOAD_ORDERS_FAILED: 'Não foi possível carregar as comandas. Tente novamente.',
  LOAD_NOTIFICATIONS_FAILED: 'Não foi possível carregar as notificações. Tente novamente.',
  LOAD_AUDIT_LOGS_FAILED: 'Não foi possível carregar o histórico de auditoria. Tente novamente.',
  LOAD_FINANCIAL_DATA_FAILED: 'Não foi possível carregar os dados financeiros. Tente novamente.',
  LOAD_SETTINGS_FAILED: 'Não foi possível carregar as configurações. Tente novamente.',
  LOAD_FORM_DATA_FAILED: 'Não foi possível carregar os dados do formulário. Tente novamente.',
  LOAD_AVAILABILITY_FAILED: 'Não foi possível verificar a disponibilidade. Tente novamente.',
  LOAD_PROFILE_FAILED: 'Não foi possível carregar os dados do perfil. Tente novamente.',
  
  // Operações de salvamento
  SAVE_CLIENT_FAILED: 'Não foi possível salvar o cliente. Verifique os dados e tente novamente.',
  SAVE_SERVICE_FAILED: 'Não foi possível salvar o serviço. Verifique os dados e tente novamente.',
  SAVE_PRODUCT_FAILED: 'Não foi possível salvar o produto. Verifique os dados e tente novamente.',
  SAVE_COLLABORATOR_FAILED: 'Não foi possível salvar o colaborador. Verifique os dados e tente novamente.',
  SAVE_APPOINTMENT_FAILED: 'Não foi possível salvar o agendamento. Verifique os dados e tente novamente.',
  SAVE_ORDER_FAILED: 'Não foi possível salvar a comanda. Tente novamente.',
  SAVE_EXPENSE_FAILED: 'Não foi possível salvar o custo. Verifique os dados e tente novamente.',
  SAVE_SETTINGS_FAILED: 'Não foi possível salvar as configurações. Verifique os dados e tente novamente.',
  SAVE_PERMISSIONS_FAILED: 'Não foi possível salvar as permissões. Tente novamente.',
  SAVE_PROFILE_FAILED: 'Não foi possível salvar o perfil. Verifique os dados e tente novamente.',
  
  // Operações de exclusão
  DELETE_CLIENT_FAILED: 'Não foi possível excluir o cliente. Tente novamente.',
  DELETE_SERVICE_FAILED: 'Não foi possível excluir o serviço. Tente novamente.',
  DELETE_PRODUCT_FAILED: 'Não foi possível excluir o produto. Tente novamente.',
  DELETE_COLLABORATOR_FAILED: 'Não foi possível excluir o colaborador. Tente novamente.',
  DELETE_EXPENSE_FAILED: 'Não foi possível remover o custo. Tente novamente.',
  DELETE_CATEGORY_FAILED: 'Não foi possível remover a categoria. Tente novamente.',
  
  // Operações de comanda
  OPEN_ORDER_FAILED: 'Não foi possível abrir a comanda. Tente novamente.',
  ADD_SERVICE_TO_ORDER_FAILED: 'Não foi possível adicionar o serviço à comanda. Tente novamente.',
  ADD_PRODUCT_TO_ORDER_FAILED: 'Não foi possível adicionar o produto à comanda. Tente novamente.',
  REMOVE_ORDER_ITEM_FAILED: 'Não foi possível remover o item da comanda. Tente novamente.',
  CONFIRM_PAYMENT_FAILED: 'Não foi possível confirmar o pagamento. Tente novamente.',
  
  // Agendamentos
  UPDATE_APPOINTMENT_STATUS_FAILED: 'Não foi possível atualizar o status do agendamento. Tente novamente.',
  CONFIRM_APPOINTMENT_FAILED: 'Não foi possível confirmar seu agendamento. Por favor, tente novamente.',
  
  // WhatsApp e mensagens
  SEND_MESSAGE_FAILED: 'Não foi possível enviar a mensagem. Verifique a configuração do WhatsApp.',
  TEST_WHATSAPP_FAILED: 'Não foi possível testar a conexão do WhatsApp. Verifique as configurações.',
  
  // Pagamentos
  SAVE_PAYMENT_SETTINGS_FAILED: 'Não foi possível salvar as configurações de pagamento.',
  TEST_PAYMENT_FAILED: 'Não foi possível validar a conexão de pagamento. Verifique as credenciais.',
  
  // Totem
  CLIENT_NOT_FOUND: 'Cliente não encontrado. Verifique o telefone ou faça um novo cadastro.',
  TOTEM_REGISTRATION_FAILED: 'Não foi possível realizar o cadastro. Verifique os dados e tente novamente.',
  
  // Exportação
  GENERATE_PDF_FAILED: 'Não foi possível gerar o PDF. Tente novamente.',
  
  // Conexão
  CONNECTION_FAILED: 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.',
  REQUEST_TIMEOUT: 'A requisição demorou muito. Verifique sua conexão e tente novamente.',

  // Genérico
  GENERIC_ERROR: 'Ocorreu um erro inesperado. Tente novamente.',
  PERMISSION_DENIED: 'Você não tem permissão para realizar esta ação.',
  NOT_FOUND: 'O recurso solicitado não foi encontrado.',
};

/**
 * Retorna uma mensagem de erro amigável para o usuário
 * Sempre usa a mensagem padrão para evitar expor erros técnicos
 */
export function getUserFriendlyError(error: unknown, defaultMessage: string): string {
  // Log do erro para debug (apenas no console, não para o usuário)
  console.error('Error details:', error);
  
  // Se o erro é uma instância de Error e tem uma mensagem que parece amigável
  // (começa com letra maiúscula e está em português), podemos usá-la
  if (error instanceof Error) {
    const msg = error.message;
    
    // Verifica se a mensagem parece ser amigável (em português e não técnica)
    const seemsFriendly = /^[A-ZÁÉÍÓÚÂÊÎÔÛÃÕÇ]/.test(msg) && 
                          !msg.includes('Error') &&
                          !msg.includes('error') &&
                          !msg.includes('failed') &&
                          !msg.includes('Failed') &&
                          !msg.includes('undefined') &&
                          !msg.includes('null') &&
                          !msg.includes('Cannot') &&
                          !msg.includes('cannot') &&
                          msg.length < 200;
    
    if (seemsFriendly) {
      return msg;
    }
  }
  
  // Sempre retorna a mensagem padrão para erros técnicos
  return defaultMessage;
}

/**
 * Mapeia erros comuns do backend para mensagens amigáveis
 */
export function mapBackendError(error: unknown): string {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    
    if (msg.includes('unauthorized') || msg.includes('não autorizado')) {
      return ERROR_MESSAGES.SESSION_EXPIRED;
    }
    
    if (msg.includes('forbidden') || msg.includes('permissão')) {
      return ERROR_MESSAGES.PERMISSION_DENIED;
    }
    
    if (msg.includes('not found') || msg.includes('não encontrad')) {
      return ERROR_MESSAGES.NOT_FOUND;
    }
    
    if (msg.includes('timeout') || msg.includes('timed out')) {
      return ERROR_MESSAGES.REQUEST_TIMEOUT;
    }
    
    if (msg.includes('network') || msg.includes('fetch') || msg.includes('connection')) {
      return ERROR_MESSAGES.CONNECTION_FAILED;
    }
  }
  
  return ERROR_MESSAGES.GENERIC_ERROR;
}
