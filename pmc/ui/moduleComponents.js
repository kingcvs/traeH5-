// 游戏模块按钮组件
const ModuleComponents = {
    // 模块按钮 - 通用
    moduleButton: function(options) {
        options = options || {};
        return '<div class="module-btn' + (options.variant ? ' module-btn--' + options.variant : '') + '" ' + (options.onclick ? 'onclick="' + options.onclick + '"' : '') + '>' +
            '<div class="module-btn__left">' +
                (options.icon ? '<div class="module-btn__icon">' + options.icon + '</div>' : '') +
                '<div class="module-btn__content">' +
                    (options.title ? '<div class="module-btn__title">' + options.title + '</div>' : '') +
                    (options.subtitle ? '<div class="module-btn__subtitle">' + options.subtitle + '</div>' : '') +
                '</div>' +
            '</div>' +
            '<div class="module-btn__right">' +
                (options.badge ? '<div class="module-btn__badge">' + options.badge + '</div>' : '') +
                (options.progress !== undefined ? 
                    '<div>' +
                        '<div class="module-btn__progress">' +
                            '<div class="module-btn__progress-fill" style="width:' + options.progress + '%"></div>' +
                        '</div>' +
                        (options.progressText ? '<div class="module-btn__progress-text">' + options.progressText + '</div>' : '') +
                    '</div>' : '') +
                (options.showArrow !== false ? '<div class="module-btn__arrow">→</div>' : '') +
            '</div>' +
        '</div>';
    },

    // 模块按钮网格
    moduleButtonGrid: function(buttons) {
        var html = '<div class="module-grid">';
        buttons.forEach(function(btn) {
            html += this.moduleButton(btn);
        }.bind(this));
        html += '</div>';
        return html;
    },

    // 模块卡片
    moduleCard: function(options) {
        options = options || {};
        return '<div class="module-card' + (options.clickable ? ' module-card--clickable' : '') + '" ' + (options.onclick ? 'onclick="' + options.onclick + '"' : '') + '>' +
            (options.header ? '<div class="card-header">' + options.header + '</div>' : '') +
            (options.content ? '<div class="module-card__content">' + options.content + '</div>' : '') +
            (options.footer ? '<div class="module-card__footer">' + options.footer + '</div>' : '') +
        '</div>';
    },

    // 筛选按钮组
    filterButtonGroup: function(options) {
        var html = '<div class="filter-group">';
        options.filters.forEach(function(filter) {
            html += '<button class="filter-btn' + (filter.active ? ' active' : '') + '" ' + (filter.onclick ? 'onclick="' + filter.onclick + '"' : '') + '>' +
                (filter.icon ? filter.icon + ' ' : '') +
                filter.label +
                (filter.count !== undefined ? '<span class="filter-btn__count">' + filter.count + '</span>' : '') +
            '</button>';
        });
        html += '</div>';
        return html;
    },

    // 状态徽章
    statusBadge: function(options) {
        options = options || {};
        return '<span class="status-badge' + (options.variant ? ' status-badge--' + options.variant : '') + '">' +
            (options.icon ? options.icon + ' ' : '') +
            options.text +
        '</span>';
    },

    // 排名徽章
    rankBadge: function(rank, isTop) {
        return '<span class="rank-badge' + (isTop ? ' rank-badge--top' : '') + '">#' + rank + '</span>';
    },

    // 统计行
    statsRow: function(options) {
        options = options || {};
        return '<div class="stats-row">' +
            '<div class="stats-row__label">' + options.label + '</div>' +
            '<div class="stats-row__value' + (options.valueVariant ? ' stats-row__value--' + options.valueVariant : '') + '">' + 
                options.value + 
            '</div>' +
        '</div>';
    },

    // 详情网格项
    detailItem: function(options) {
        options = options || {};
        return '<div class="detail-item">' +
            '<div class="detail-item__label">' + options.label + '</div>' +
            '<div class="detail-item__value' + (options.variant ? ' detail-item__value--' + options.variant : '') + '">' + 
                options.value + 
            '</div>' +
        '</div>';
    },

    // 操作列表项
    actionItem: function(options) {
        options = options || {};
        return '<div class="action-item"' + (options.onclick ? 'onclick="' + options.onclick + '"' : '') + '>' +
            '<div class="action-item__left">' +
                (options.icon ? '<div class="action-item__icon">' + options.icon + '</div>' : '') +
                '<div>' +
                    '<div class="action-item__text">' + options.text + '</div>' +
                    (options.sub ? '<div class="action-item__sub">' + options.sub + '</div>' : '') +
                '</div>' +
            '</div>' +
            (options.showArrow !== false ? '<div class="action-item__right">→</div>' : '') +
        '</div>';
    },

    // 操作列表
    actionList: function(items) {
        var html = '<div class="action-list">';
        items.forEach(function(item) {
            html += this.actionItem(item);
        }.bind(this));
        html += '</div>';
        return html;
    }
};
