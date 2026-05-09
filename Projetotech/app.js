/**
 * App - Controlador de UI para Busca de Eventos
 * Gerencia interações, renderização e estado
 * @version 2.0
 * @date 2026-05-09
 */

class EventSearchApp {
    constructor() {
        this.apiService = apiService;
        this.currentEvents = [];
        this.currentFilters = {
            search: '',
            category: '',
            date: ''
        };
        this.debounceTimer = null;
        this.debounceDelay = 300; // ms

        this.initializeElements();
        this.attachEventListeners();
        this.loadInitialEvents();
    }

    /**
     * Inicializa referências aos elementos do DOM
     */
    initializeElements() {
        this.elements = {
            searchInput: document.getElementById('searchInput'),
            categoryFilter: document.getElementById('categoryFilter'),
            dateFilter: document.getElementById('dateFilter'),
            searchBtn: document.getElementById('searchBtn'),
            clearBtn: document.getElementById('clearFiltersBtn'),
            eventsContainer: document.getElementById('eventsContainer'),
            activeFiltersDiv: document.getElementById('activeFilters')
        };

        // Valida se todos os elementos existem
        for (const [key, element] of Object.entries(this.elements)) {
            if (!element) {
                console.warn(`Elemento não encontrado: ${key}`);
            }
        }
    }

    /**
     * Anexa listeners aos elementos
     */
    attachEventListeners() {
        // Busca ao clicar no botão
        if (this.elements.searchBtn) {
            this.elements.searchBtn.addEventListener('click', () => this.performSearch());
        }

        // Busca ao pressionar Enter
        if (this.elements.searchInput) {
            this.elements.searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch();
                }
            });
        }

        // Busca com debounce ao digitar
        if (this.elements.searchInput) {
            this.elements.searchInput.addEventListener('input', () => this.debouncedSearch());
        }

        // Busca ao mudar categoria
        if (this.elements.categoryFilter) {
            this.elements.categoryFilter.addEventListener('change', () => this.performSearch());
        }

        // Busca ao mudar data
        if (this.elements.dateFilter) {
            this.elements.dateFilter.addEventListener('change', () => this.performSearch());
        }

        // Limpa filtros
        if (this.elements.clearBtn) {
            this.elements.clearBtn.addEventListener('click', () => this.clearFilters());
        }
    }

    /**
     * Debounce para busca em tempo real (evita múltiplas requisições)
     */
    debouncedSearch() {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            this.performSearch();
        }, this.debounceDelay);
    }

    /**
     * Realiza a busca
     */
    async performSearch() {
        try {
            // Atualiza filtros atuais
            this.currentFilters = {
                search: this.elements.searchInput?.value || '',
                category: this.elements.categoryFilter?.value || '',
                date: this.elements.dateFilter?.value || ''
            };

            // Mostra loading
            this.showLoading();

            // Busca eventos
            let events = await this.apiService.searchEvents(
                this.currentFilters.search,
                this.currentFilters.category,
                this.currentFilters.date
            );

            // Filtra localmente
            events = this.apiService.filterEvents(
                events,
                this.currentFilters.category,
                this.currentFilters.date,
                this.currentFilters.search
            );

            this.currentEvents = events;
            this.updateURL();
            this.renderEvents();
            this.renderActiveFilters();
            this.hideLoading();

            // Log para analytics
            console.log(`Busca realizada: ${events.length} eventos encontrados`, this.currentFilters);
        } catch (error) {
            console.error('Erro ao buscar eventos:', error);
            this.showError('Erro ao buscar eventos. Tente novamente.');
            this.hideLoading();
        }
    }

    /**
     * Carrega eventos iniciais
     */
    async loadInitialEvents() {
        try {
            // Verifica se há parâmetros na URL
            const params = new URLSearchParams(window.location.search);
            const search = params.get('search') || '';
            const category = params.get('category') || '';
            const date = params.get('date') || '';

            // Preenche filtros
            if (this.elements.searchInput && search) {
                this.elements.searchInput.value = search;
            }
            if (this.elements.categoryFilter && category) {
                this.elements.categoryFilter.value = category;
            }
            if (this.elements.dateFilter && date) {
                this.elements.dateFilter.value = date;
            }

            // Se há filtros, busca; senão mostra eventos padrão
            if (search || category || date) {
                await this.performSearch();
            } else {
                const events = await this.apiService.searchEvents();
                this.currentEvents = events;
                this.renderEvents();
            }
        } catch (error) {
            console.error('Erro ao carregar eventos iniciais:', error);
            this.showError('Erro ao carregar eventos');
        }
    }

    /**
     * Renderiza os eventos no DOM
     */
    renderEvents() {
        if (!this.elements.eventsContainer) return;

        if (this.currentEvents.length === 0) {
            this.elements.eventsContainer.innerHTML = `
                <div class="no-results">
                    <p>😔 Nenhum evento encontrado com os filtros selecionados.</p>
                </div>
            `;
            return;
        }

        const eventsHTML = this.currentEvents.map(event => this.createEventCard(event)).join('');
        this.elements.eventsContainer.innerHTML = eventsHTML;

        // Adiciona listeners aos botões de compartilhamento
        document.querySelectorAll('[data-event-share]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const eventId = e.currentTarget.dataset.eventShare;
                const event = this.currentEvents.find(e => e.id === eventId);
                if (event) this.shareEvent(event);
            });
        });
    }

    /**
     * Cria um card de evento
     */
    createEventCard(event) {
        const eventDate = new Date(event.date);
        const formattedDate = eventDate.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        return `
            <article class="event-card" data-event-id="${event.id}">
                <div class="event-card-header">
                    <div>
                        <h3>${this.escapeHtml(event.title)}</h3>
                        <div class="event-date">📅 ${formattedDate} às ${event.time}</div>
                    </div>
                </div>
                <div class="event-card-body">
                    <div class="event-info">
                        <strong>📍 Local:</strong>
                        <span>${this.escapeHtml(event.location)}</span>
                    </div>
                    <div class="event-info">
                        <strong>📮 Endereço:</strong>
                        <span>${this.escapeHtml(event.address)}</span>
                    </div>
                    <p style="color: #666; margin-bottom: 1rem; font-size: 0.95rem;">
                        ${this.escapeHtml(event.description)}
                    </p>
                    <div style="display: flex; gap: 0.5rem; align-items: center; margin-top: 1rem;">
                        <span class="event-category">${this.escapeHtml(event.category)}</span>
                        <span style="font-size: 0.85rem; color: #999;">Fonte: ${this.escapeHtml(event.source)}</span>
                        ${event.price ? `<span style="font-size: 0.85rem; color: #0aa650; font-weight: 600;">${this.escapeHtml(event.price)}</span>` : ''}
                    </div>
                    <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                        <button 
                            class="gov-btn btn-secondary" 
                            data-event-share="${event.id}"
                            style="flex: 1; font-size: 0.9rem;"
                        >
                            📤 Compartilhar
                        </button>
                        ${event.url && event.url !== '#' ? `
                            <a 
                                href="${event.url}" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                class="gov-btn btn-primary"
                                style="flex: 1; text-decoration: none; font-size: 0.9rem;"
                            >
                                🔗 Saiba Mais
                            </a>
                        ` : ''}
                    </div>
                </div>
            </article>
        `;
    }

    /**
     * Renderiza filtros ativos
     */
    renderActiveFilters() {
        if (!this.elements.activeFiltersDiv) return;

        const activeFilters = [];
        if (this.currentFilters.search) {
            activeFilters.push(`Busca: <strong>${this.escapeHtml(this.currentFilters.search)}</strong>`);
        }
        if (this.currentFilters.category) {
            activeFilters.push(`Categoria: <strong>${this.escapeHtml(this.currentFilters.category)}</strong>`);
        }
        if (this.currentFilters.date) {
            activeFilters.push(`Data: <strong>${this.escapeHtml(this.currentFilters.date)}</strong>`);
        }

        if (activeFilters.length === 0) {
            this.elements.activeFiltersDiv.style.display = 'none';
            return;
        }

        this.elements.activeFiltersDiv.style.display = 'block';
        this.elements.activeFiltersDiv.innerHTML = `
            <p style="margin: 0; font-weight: 600; margin-bottom: 0.5rem;">Filtros ativos:</p>
            <div>${activeFilters.join(' | ')}</div>
        `;
    }

    /**
     * Limpa todos os filtros
     */
    clearFilters() {
        if (this.elements.searchInput) this.elements.searchInput.value = '';
        if (this.elements.categoryFilter) this.elements.categoryFilter.value = '';
        if (this.elements.dateFilter) this.elements.dateFilter.value = '';

        this.currentFilters = { search: '', category: '', date: '' };
        this.updateURL();
        this.performSearch();
    }

    /**
     * Compartilha evento
     */
    shareEvent(event) {
        const shareText = `${event.title} - ${new Date(event.date).toLocaleDateString('pt-BR')} - ${event.location}`;
        const shareUrl = `${window.location.origin}${window.location.pathname}?search=${encodeURIComponent(event.title)}`;

        if (navigator.share) {
            // Share API nativa
            navigator.share({
                title: event.title,
                text: shareText,
                url: shareUrl
            }).catch(err => console.log('Compartilhamento cancelado:', err));
        } else {
            // Fallback: Copia para clipboard
            navigator.clipboard.writeText(shareText + '\n' + shareUrl)
                .then(() => this.showSuccess('Evento copiado para a área de transferência!'))
                .catch(err => console.error('Erro ao copiar:', err));
        }
    }

    /**
     * Atualiza URL com filtros atuais
     */
    updateURL() {
        const params = new URLSearchParams();
        
        if (this.currentFilters.search) {
            params.append('search', this.currentFilters.search);
        }
        if (this.currentFilters.category) {
            params.append('category', this.currentFilters.category);
        }
        if (this.currentFilters.date) {
            params.append('date', this.currentFilters.date);
        }

        const url = params.toString() 
            ? `${window.location.pathname}?${params.toString()}`
            : window.location.pathname;

        window.history.replaceState({}, '', url);
    }

    /**
     * Escape HTML para XSS protection
     */
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return String(text).replace(/[&<>"']/g, m => map[m]);
    }

    /**
     * Mostra estado de loading
     */
    showLoading() {
        if (this.elements.eventsContainer) {
            this.elements.eventsContainer.innerHTML = `
                <div class="no-results">
                    <div style="text-align: center;">
                        <div class="spinner" style="margin: 0 auto 1rem;"></div>
                        <p>Buscando eventos...</p>
                    </div>
                </div>
            `;
        }
    }

    /**
     * Esconde estado de loading
     */
    hideLoading() {
        // Implementado na renderEvents
    }

    /**
     * Mostra mensagem de sucesso
     */
    showSuccess(message) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-success';
        alert.textContent = message;
        alert.style.position = 'fixed';
        alert.style.top = '80px';
        alert.style.right = '1rem';
        alert.style.zIndex = '1000';
        alert.style.maxWidth = '300px';
        
        document.body.appendChild(alert);
        
        setTimeout(() => {
            alert.remove();
        }, 3000);
    }

    /**
     * Mostra mensagem de erro
     */
    showError(message) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-error';
        alert.textContent = message;
        alert.style.position = 'fixed';
        alert.style.top = '80px';
        alert.style.right = '1rem';
        alert.style.zIndex = '1000';
        alert.style.maxWidth = '300px';
        
        document.body.appendChild(alert);
        
        setTimeout(() => {
            alert.remove();
        }, 5000);
    }
}

// Inicializa app quando DOM está pronto
document.addEventListener('DOMContentLoaded', () => {
    window.app = new EventSearchApp();
    console.log('EventSearchApp inicializado');
});
