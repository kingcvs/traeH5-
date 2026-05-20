// 资本界面交互逻辑
const CapitalActions = {
    // 打开银行详情
    openBank: function(bankId) {
        const state = GameState.get();
        const bank = InitialData.getBanks().find(function(b) {
            return b.id === bankId;
        });
        
        if (!bank) {
            UI.showToast('银行不存在');
            return;
        }
        
        const relation = state.bankRelations[bankId] || { relation: 50 };
        
        // 检查是否可以贷款
        if (relation.relation < 30) {
            UI.showModal(
                '<div style="text-align:center;padding:20px">' +
                    '<div style="font-size:48px;margin-bottom:16px">🚫</div>' +
                    '<div style="font-size:18px;font-weight:700;margin-bottom:8px">关系值过低</div>' +
                    '<div style="color:#94a3b8;font-size:14px">关系值低于30，银行拒绝与您合作</div>' +
                    '<div style="margin-top:16px;padding:12px;background:rgba(239,68,68,0.1);border-radius:8px">' +
                        '<div style="color:#ef4444;font-weight:600">当前关系值: ' + relation.relation + '</div>' +
                        '<div style="color:#94a3b8;font-size:12px;margin-top:8px">建议：按时还款可增加关系值</div>' +
                    '</div>' +
                '</div>',
                {
                    title: '🏦 ' + bank.name,
                    footer: '<button class="btn btn-secondary" onclick="document.querySelector(\'.modal-overlay\').remove()">关闭</button>'
                }
            );
            return;
        }
        
        // 计算可贷款额度
        const netAssets = state.company.totalAssets - state.company.liabilities;
        const creditLeverage = state.company.creditLeverage || 0.05;
        let quotaFromAssets = netAssets * creditLeverage;
        
        // 根据关系调整额度
        let quotaMultiplier = 1;
        if (relation.relation > 80) {
            quotaMultiplier = 1.2;
        } else if (relation.relation >= 30 && relation.relation <= 49) {
            quotaMultiplier = 0.8;
        }
        
        const maxQuota = quotaFromAssets * quotaMultiplier;
        
        // 显示银行详情
        UI.showModal(
            '<div style="padding:10px">' +
                '<div class="card" style="margin-bottom:16px">' +
                    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">' +
                        '<div style="font-weight:700;font-size:18px">' + bank.name + '</div>' +
                        '<div style="font-size:20px;font-weight:700;color:#22c55e">' + (bank.baseRate * 100).toFixed(1) + '%</div>' +
                    '</div>' +
                    '<div style="color:#94a3b8;font-size:13px">' + bank.feature + '</div>' +
                '</div>' +
                
                '<div class="card" style="margin-bottom:16px">' +
                    '<div class="card-title">📊 关系状态</div>' +
                    '<div style="margin-top:12px">' +
                        '<div style="display:flex;justify-content:space-between;margin-bottom:6px">' +
                            '<span>关系值</span>' +
                            '<span style="font-weight:700;color:' + (relation.relation > 80 ? '#22c55e' : relation.relation >= 50 ? '#f59e0b' : '#ef4444') + '">' + relation.relation + '</span>' +
                        '</div>' +
                        '<div class="progress-bar">' +
                            '<div class="progress-fill" style="width:' + relation.relation + '%;background:' + (relation.relation > 80 ? '#22c55e' : relation.relation >= 50 ? '#f59e0b' : '#ef4444') + '"></div>' +
                        '</div>' +
                    '</div>' +
                    '<div style="margin-top:12px;font-size:12px;color:#94a3b8">' +
                        '• 关系>80: 利率-0.3%额度+20%<br>' +
                        '• 关系50-79: 正常<br>' +
                        '• 关系30-49: 审批慢额度-20%利率+0.3%<br>' +
                        '• 关系<30: 拒贷' +
                    '</div>' +
                '</div>' +
                
                '<div class="card" style="margin-bottom:16px">' +
                    '<div class="card-title">💰 可贷额度</div>' +
                    '<div style="margin-top:12px">' +
                        '<div style="font-size:24px;font-weight:700;color:#22c55e">' + Utils.formatMoney(maxQuota) + '</div>' +
                        '<div style="color:#94a3b8;font-size:12px;margin-top:8px">' +
                            '基于净资产 × 信用杠杆 × 关系系数' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                
                '<button class="btn btn-primary btn-full" onclick="CapitalActions.applyLoan(\'' + bankId + '\')">' +
                    '📋 申请贷款' +
                '</button>' +
            '</div>',
            {
                title: '🏦 ' + bank.name,
                footer: '<button class="btn btn-secondary" onclick="document.querySelector(\'.modal-overlay\').remove()">取消</button>'
            }
        );
    },
    
    // 申请贷款
    applyLoan: function(bankId) {
        const state = GameState.get();
        const bank = InitialData.getBanks().find(function(b) {
            return b.id === bankId;
        });
        
        if (!bank) return;
        
        // 关闭当前模态框
        const overlay = document.querySelector('.modal-overlay');
        if (overlay) overlay.remove();
        
        // 显示贷款申请流程
        this.showLoanApplicationFlow(bankId, bank);
    },
    
    // 显示贷款申请流程
    showLoanApplicationFlow: function(bankId, bank) {
        // 步骤1：输入贷款金额
        UI.showModal(
            '<div style="padding:10px">' +
                '<div style="margin-bottom:16px;text-align:center">' +
                    '<div style="font-size:32px;font-weight:700;margin-bottom:8px">第一步：确定贷款金额</div>' +
                    '<div style="color:#94a3b8;font-size:14px">选择您需要的贷款金额</div>' +
                '</div>' +
                
                '<div class="form-group">' +
                    '<label class="form-label">贷款金额</label>' +
                    '<input type="number" id="loanAmount" class="form-input" placeholder="请输入贷款金额" min="1000000" max="100000000" step="1000000" value="10000000">' +
                '</div>' +
                
                '<div style="margin-top:16px;font-size:13px;color:#94a3b8">' +
                    '💡 建议金额范围：100万 - 1亿<br>' +
                    '⚠️ 贷款金额需与项目规模匹配' +
                '</div>' +
            '</div>',
            {
                title: '📋 贷款申请 - ' + bank.name,
                footer: 
                    '<button class="btn btn-secondary" onclick="document.querySelector(\'.modal-overlay\').remove()">取消</button>' +
                    '<button class="btn btn-primary" style="margin-left:10px" onclick="CapitalActions.confirmLoanAmount(\'' + bankId + '\')">下一步</button>'
            }
        );
    },
    
    // 确认贷款金额
    confirmLoanAmount: function(bankId) {
        const amountInput = document.getElementById('loanAmount');
        if (!amountInput) return;
        
        const amount = parseInt(amountInput.value);
        if (isNaN(amount) || amount < 1000000) {
            UI.showToast('贷款金额至少100万');
            return;
        }
        
        this.currentLoanApplication = {
            bankId: bankId,
            amount: amount
        };
        
        // 显示步骤2：选择贷款产品
        this.showLoanProductSelection();
    },
    
    // 显示贷款产品选择
    showLoanProductSelection: function() {
        const application = this.currentLoanApplication;
        if (!application) return;
        
        const bank = InitialData.getBanks().find(function(b) {
            return b.id === application.bankId;
        });
        
        const products = [
            { id: 'working', name: '流动资金贷', term: '12个月', desc: '用于日常经营周转' },
            { id: 'development', name: '项目开发贷', term: '24-36个月', desc: '用于房地产项目开发' },
            { id: 'property', name: '物业贷', term: '60-120个月', desc: '用于物业购置和改造' },
            { id: 'merger', name: '并购贷', term: '60-84个月', desc: '用于企业并购重组' }
        ];
        
        let productHtml = products.map(function(product) {
            return '<div class="card" style="margin-bottom:10px;cursor:pointer" onclick="CapitalActions.selectProduct(\'' + product.id + '\')">' +
                '<div style="display:flex;justify-content:space-between;align-items:center">' +
                    '<div>' +
                        '<div style="font-weight:600">' + product.name + '</div>' +
                        '<div style="color:#94a3b8;font-size:12px;margin-top:4px">' + product.desc + '</div>' +
                    '</div>' +
                    '<div style="text-align:right">' +
                        '<div style="color:#3b82f6;font-weight:600">' + product.term + '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';
        }).join('');
        
        UI.showModal(
            '<div style="padding:10px">' +
                '<div style="margin-bottom:16px;text-align:center">' +
                    '<div style="font-size:32px;font-weight:700;margin-bottom:8px">第二步：选择贷款产品</div>' +
                    '<div style="color:#94a3b8;font-size:14px">根据资金用途选择合适的贷款产品</div>' +
                '</div>' +
                productHtml +
            '</div>',
            {
                title: '📋 贷款申请 - ' + bank.name,
                footer: '<button class="btn btn-secondary" onclick="document.querySelector(\'.modal-overlay\').remove()">取消</button>'
            }
        );
    },
    
    // 选择贷款产品
    selectProduct: function(productId) {
        const products = {
            'working': { name: '流动资金贷', term: 12, rateAdjustment: 0 },
            'development': { name: '项目开发贷', term: 30, rateAdjustment: -0.005 },
            'property': { name: '物业贷', term: 90, rateAdjustment: 0.01 },
            'merger': { name: '并购贷', term: 72, rateAdjustment: 0.02 }
        };
        
        const product = products[productId];
        if (!product || !this.currentLoanApplication) return;
        
        this.currentLoanApplication.product = product;
        
        // 关闭当前模态框并显示步骤3
        const overlay = document.querySelector('.modal-overlay');
        if (overlay) overlay.remove();
        
        // 显示步骤3：利率谈判
        setTimeout(function() {
            this.showRateNegotiation();
        }.bind(this), 100);
    },
    
    // 显示利率谈判
    showRateNegotiation: function() {
        const application = this.currentLoanApplication;
        if (!application) return;
        
        const bank = InitialData.getBanks().find(function(b) {
            return b.id === application.bankId;
        });
        
        const state = GameState.get();
        const relation = state.bankRelations[application.bankId] || { relation: 50 };
        
        // 计算实际利率
        let rateAdjustment = 0;
        if (relation.relation > 80) {
            rateAdjustment = -0.003;
        } else if (relation.relation >= 30 && relation.relation <= 49) {
            rateAdjustment = 0.003;
        }
        
        rateAdjustment += application.product.rateAdjustment;
        
        const baseRate = bank.baseRate;
        const finalRate = baseRate + rateAdjustment;
        
        application.baseRate = baseRate;
        application.finalRate = finalRate;
        application.term = application.product.term;
        
        UI.showModal(
            '<div style="padding:10px">' +
                '<div style="margin-bottom:16px;text-align:center">' +
                    '<div style="font-size:32px;font-weight:700;margin-bottom:8px">第三步：利率谈判</div>' +
                    '<div style="color:#94a3b8;font-size:14px">银行报价利率，可选择谈判或接受</div>' +
                '</div>' +
                
                '<div class="card" style="margin-bottom:16px;text-align:center">' +
                    '<div style="color:#94a3b8;font-size:14px;margin-bottom:8px">银行报价利率</div>' +
                    '<div style="font-size:36px;font-weight:800;color:#22c55e">' + (finalRate * 100).toFixed(2) + '%</div>' +
                    '<div style="color:#94a3b8;font-size:12px;margin-top:8px">基础利率 ' + (baseRate * 100).toFixed(1) + '% + 调整 ' + (rateAdjustment * 100 > 0 ? '+' : '') + (rateAdjustment * 100).toFixed(1) + '%</div>' +
                '</div>' +
                
                '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">' +
                    '<button class="btn btn-primary" onclick="CapitalActions.acceptRate()">' +
                        '✅ 接受报价' +
                    '</button>' +
                    '<button class="btn btn-secondary" onclick="CapitalActions.negotiateRate()">' +
                        '💬 尝试议价' +
                    '</button>' +
                '</div>' +
            '</div>',
            {
                title: '📋 贷款申请 - ' + bank.name,
                footer: '<button class="btn btn-secondary" onclick="document.querySelector(\'.modal-overlay\').remove()">取消申请</button>'
            }
        );
    },
    
    // 接受利率
    acceptRate: function() {
        if (!this.currentLoanApplication) return;
        
        const overlay = document.querySelector('.modal-overlay');
        if (overlay) overlay.remove();
        
        setTimeout(function() {
            this.showLoanTerms();
        }.bind(this), 100);
    },
    
    // 尝试议价
    negotiateRate: function() {
        const application = this.currentLoanApplication;
        if (!application) return;
        
        const state = GameState.get();
        const relation = state.bankRelations[application.bankId] || { relation: 50 };
        
        // 谈判成功率：40%降0.2-0.5%，30%不让步，30%拒贷
        const roll = Math.random();
        let result = '';
        let newRate = application.finalRate;
        
        if (roll < 0.4) {
            // 谈判成功
            const reduction = 0.002 + Math.random() * 0.003;
            newRate -= reduction;
            result = 'success';
        } else if (roll < 0.7) {
            // 不让步
            result = 'no_change';
        } else {
            // 拒贷
            result = 'rejected';
        }
        
        if (result === 'success') {
            application.finalRate = newRate;
            UI.showModal(
                '<div style="text-align:center;padding:30px">' +
                    '<div style="font-size:48px;margin-bottom:16px">🎉</div>' +
                    '<div style="font-size:18px;font-weight:700;margin-bottom:8px;color:#22c55e">谈判成功！</div>' +
                    '<div style="color:#94a3b8;font-size:14px">利率降低至 ' + (newRate * 100).toFixed(2) + '%</div>' +
                '</div>',
                {
                    title: '💬 议价结果',
                    footer: '<button class="btn btn-primary" onclick="CapitalActions.acceptRate()">继续</button>'
                }
            );
        } else if (result === 'no_change') {
            UI.showModal(
                '<div style="text-align:center;padding:30px">' +
                    '<div style="font-size:48px;margin-bottom:16px">🤷</div>' +
                    '<div style="font-size:18px;font-weight:700;margin-bottom:8px">银行不让步</div>' +
                    '<div style="color:#94a3b8;font-size:14px">银行坚持原报价利率</div>' +
                '</div>',
                {
                    title: '💬 议价结果',
                    footer: 
                        '<button class="btn btn-secondary" onclick="document.querySelector(\'.modal-overlay\').remove()">取消</button>' +
                        '<button class="btn btn-primary" style="margin-left:10px" onclick="CapitalActions.acceptRate()">接受原报价</button>'
                }
            );
        } else {
            UI.showModal(
                '<div style="text-align:center;padding:30px">' +
                    '<div style="font-size:48px;margin-bottom:16px">😔</div>' +
                    '<div style="font-size:18px;font-weight:700;margin-bottom:8px;color:#ef4444">银行拒绝</div>' +
                    '<div style="color:#94a3b8;font-size:14px">您的议价行为惹恼了银行</div>' +
                    '<div style="margin-top:16px;padding:12px;background:rgba(239,68,68,0.1);border-radius:8px">' +
                        '<div style="color:#ef4444;font-size:13px">关系值 -5</div>' +
                    '</div>' +
                '</div>',
                {
                    title: '💬 议价结果',
                    footer: '<button class="btn btn-secondary" onclick="document.querySelector(\'.modal-overlay\').remove()">关闭</button>'
                }
            );
            
            // 更新关系值
            GameState.update(function(state) {
                if (state.bankRelations[application.bankId]) {
                    state.bankRelations[application.bankId].relation = Math.max(0, state.bankRelations[application.bankId].relation - 5);
                }
            });
            
            this.currentLoanApplication = null;
        }
    },
    
    // 显示附加条款
    showLoanTerms: function() {
        const application = this.currentLoanApplication;
        if (!application) return;
        
        const bank = InitialData.getBanks().find(function(b) {
            return b.id === application.bankId;
        });
        
        // 随机生成1-3条附加条款
        const allTerms = [
            { id: 'early_repayment', name: '提前还款违约金', desc: '2年内提前还款收取3%违约金', type: 'warning' },
            { id: 'debt_ratio', name: '负债率约束', desc: '贷款期间负债率≤75%，超了触发交叉违约', type: 'warning' },
            { id: 'fund_restriction', name: '资金用途限制', desc: '贷款资金仅限用于指定项目，不可挪用', type: 'info' },
            { id: 'cross_default', name: '交叉违约条款', desc: '他行贷款违约，本笔也视为违约', type: 'danger' },
            { id: 'min_deposit', name: '最低存款要求', desc: '需保持存款不低于贷款额的10%', type: 'info' },
            { id: 'priority_claim', name: '优先受偿权', desc: '银行对抵押物有优先受偿权', type: 'warning' }
        ];
        
        const numTerms = 1 + Math.floor(Math.random() * 3);
        const selectedTerms = [];
        const shuffled = allTerms.sort(function() { return 0.5 - Math.random(); });
        
        for (let i = 0; i < numTerms && i < shuffled.length; i++) {
            selectedTerms.push(shuffled[i]);
        }
        
        application.terms = selectedTerms;
        
        let termsHtml = selectedTerms.map(function(term) {
            const colors = {
                warning: 'rgba(245,158,11,0.1)',
                info: 'rgba(59,130,246,0.1)',
                danger: 'rgba(239,68,68,0.1)'
            };
            const borderColors = {
                warning: '#f59e0b',
                info: '#3b82f6',
                danger: '#ef4444'
            };
            
            return '<div style="padding:12px;background:' + colors[term.type] + ';border-left:3px solid ' + borderColors[term.type] + ';border-radius:8px;margin-bottom:10px">' +
                '<div style="font-weight:600;margin-bottom:4px">' + term.name + '</div>' +
                '<div style="color:#94a3b8;font-size:12px">' + term.desc + '</div>' +
            '</div>';
        }).join('');
        
        UI.showModal(
            '<div style="padding:10px">' +
                '<div style="margin-bottom:16px;text-align:center">' +
                    '<div style="font-size:32px;font-weight:700;margin-bottom:8px">第四步：附加条款</div>' +
                    '<div style="color:#94a3b8;font-size:14px">银行要求以下附加条款（可尝试谈判移除）</div>' +
                '</div>' +
                termsHtml +
            '</div>',
            {
                title: '📋 贷款申请 - ' + bank.name,
                footer: 
                    '<button class="btn btn-secondary" onclick="CapitalActions.skipTermsNegotiation()">接受条款</button>' +
                    '<button class="btn btn-primary" style="margin-left:10px" onclick="CapitalActions.negotiateTerms()">尝试移除</button>'
            }
        );
    },
    
    // 跳过条款谈判
    skipTermsNegotiation: function() {
        const overlay = document.querySelector('.modal-overlay');
        if (overlay) overlay.remove();
        
        setTimeout(function() {
            this.completeLoanApplication();
        }.bind(this), 100);
    },
    
    // 谈判移除条款
    negotiateTerms: function() {
        const application = this.currentLoanApplication;
        if (!application || !application.terms) return;
        
        // 40%成功率移除一条条款
        if (Math.random() < 0.4 && application.terms.length > 0) {
            application.terms.pop();
            
            UI.showModal(
                '<div style="text-align:center;padding:30px">' +
                    '<div style="font-size:48px;margin-bottom:16px">✅</div>' +
                    '<div style="font-size:18px;font-weight:700;margin-bottom:8px;color:#22c55e">成功移除一条条款</div>' +
                    '<div style="color:#94a3b8;font-size:14px">银行同意调整条款</div>' +
                '</div>',
                {
                    title: '💬 条款谈判',
                    footer: '<button class="btn btn-primary" onclick="CapitalActions.skipTermsNegotiation()">继续</button>'
                }
            );
        } else {
            UI.showModal(
                '<div style="text-align:center;padding:30px">' +
                    '<div style="font-size:48px;margin-bottom:16px">❌</div>' +
                    '<div style="font-size:18px;font-weight:700;margin-bottom:8px">谈判失败</div>' +
                    '<div style="color:#94a3b8;font-size:14px">银行拒绝修改附加条款</div>' +
                '</div>',
                {
                    title: '💬 条款谈判',
                    footer: '<button class="btn btn-secondary" onclick="CapitalActions.skipTermsNegotiation()">接受原条款</button>'
                }
            );
        }
    },
    
    // 完成贷款申请
    completeLoanApplication: function() {
        const application = this.currentLoanApplication;
        if (!application) return;
        
        const bank = InitialData.getBanks().find(function(b) {
            return b.id === application.bankId;
        });
        
        // 创建贷款记录
        const loan = {
            id: Utils.generateId('loan'),
            bankId: application.bankId,
            bankName: bank.name,
            productName: application.product.name,
            amount: application.amount,
            interestRate: application.finalRate,
            term: application.term,
            startDate: new Date(),
            remainingAmount: application.amount,
            remainingTerm: application.term,
            status: GameTypes.LoanStatus.ACTIVE,
            terms: application.terms || []
        };
        
        // 更新游戏状态
        GameState.update(function(state) {
            state.loans.push(loan);
            state.company.cash += application.amount;
            state.company.totalAssets += application.amount;
            state.company.liabilities += application.amount;
            
            // 更新银行关系
            if (state.bankRelations[application.bankId]) {
                state.bankRelations[application.bankId].totalLoans += application.amount;
            }
        });
        
        // 显示成功消息
        UI.showModal(
            '<div style="text-align:center;padding:30px">' +
                '<div style="font-size:48px;margin-bottom:16px">🎉</div>' +
                '<div style="font-size:20px;font-weight:700;margin-bottom:8px;color:#22c55e">贷款申请成功！</div>' +
                '<div style="margin-top:20px;padding:16px;background:rgba(34,197,94,0.1);border-radius:12px">' +
                    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:14px;text-align:left">' +
                        '<div>贷款金额</div>' +
                        '<div style="font-weight:700;color:#22c55e;text-align:right">' + Utils.formatMoney(application.amount) + '</div>' +
                        '<div>贷款利率</div>' +
                        '<div style="font-weight:700;text-align:right">' + (application.finalRate * 100).toFixed(2) + '%</div>' +
                        '<div>贷款期限</div>' +
                        '<div style="font-weight:700;text-align:right">' + application.term + '个月</div>' +
                        '<div>每月还款</div>' +
                        '<div style="font-weight:700;text-align:right">' + Utils.formatMoney(application.amount / application.term * (1 + application.finalRate / 12)) + '</div>' +
                    '</div>' +
                '</div>' +
            '</div>',
            {
                title: '✅ 贷款成功',
                footer: '<button class="btn btn-primary" onclick="document.querySelector(\'.modal-overlay\').remove();GameState.notify();">完成</button>'
            }
        );
        
        this.currentLoanApplication = null;
    },
    
    // 申请股权融资
    applyFunding: function(fundingRoundId) {
        const state = GameState.get();
        const rounds = InitialData.getFundingRounds();
        const roundIndex = rounds.findIndex(function(r) { return r.id === fundingRoundId; });
        
        if (roundIndex === -1) return;
        
        const round = rounds[roundIndex];
        
        // 检查营收门槛
        const totalRevenue = Math.random() * 100000000; // 模拟营收
        if (round.revenueThreshold > 0 && totalRevenue < round.revenueThreshold) {
            UI.showToast('未达到营收门槛: ' + Utils.formatMoney(round.revenueThreshold));
            return;
        }
        
        // 显示融资选项
        UI.showModal(
            '<div style="padding:10px">' +
                '<div style="text-align:center;margin-bottom:20px">' +
                    '<div style="font-size:20px;font-weight:700;margin-bottom:8px">' + round.name + '</div>' +
                    '<div style="color:#94a3b8;font-size:14px">选择融资方式</div>' +
                '</div>' +
                
                '<div class="card" style="cursor:pointer;margin-bottom:10px" onclick="CapitalActions.acceptFullFunding(\'' + fundingRoundId + '\')">' +
                    '<div style="font-weight:600">✅ 全额接受</div>' +
                    '<div style="color:#94a3b8;font-size:12px;margin-top:4px">接受投资方报价，出让 ' + (round.dilutionMin * 100).toFixed(0) + '%-' + (round.dilutionMax * 100).toFixed(0) + '% 股权</div>' +
                '</div>' +
                
                '<div class="card" style="cursor:pointer;margin-bottom:10px" onclick="CapitalActions.negotiateFunding(\'' + fundingRoundId + '\')">' +
                    '<div style="font-weight:600">💬 尝试议价</div>' +
                    '<div style="color:#94a3b8;font-size:12px;margin-top:4px">40%少稀释但少拿20%，30%触发对赌，30%投资人撤</div>' +
                '</div>' +
                
                '<div class="card" style="cursor:pointer" onclick="UI.showToast(\'已拒绝本轮融资\')">' +
                    '<div style="font-weight:600">❌ 拒绝</div>' +
                    '<div style="color:#94a3b8;font-size:12px;margin-top:4px">暂时不接受投资</div>' +
                '</div>' +
            '</div>',
            {
                title: '💵 ' + round.name + '融资',
                footer: '<button class="btn btn-secondary" onclick="document.querySelector(\'.modal-overlay\').remove()">取消</button>'
            }
        );
    },
    
    // 全额接受融资
    acceptFullFunding: function(fundingRoundId) {
        const rounds = InitialData.getFundingRounds();
        const round = rounds.find(function(r) { return r.id === fundingRoundId; });
        
        if (!round) return;
        
        // 计算融资额和稀释比例
        const dilution = (round.dilutionMin + round.dilutionMax) / 2;
        const valuation = Math.random() * round.valuationMultiple.max * 100000000 + 100000000;
        const fundingAmount = valuation * dilution;
        
        // 记录融资历史
        GameState.update(function(state) {
            state.fundingHistory.push({
                round: round.id,
                date: new Date(),
                amount: fundingAmount,
                dilution: dilution
            });
            
            state.company.cash += fundingAmount;
            state.company.totalAssets += fundingAmount;
        });
        
        const overlay = document.querySelector('.modal-overlay');
        if (overlay) overlay.remove();
        
        UI.showModal(
            '<div style="text-align:center;padding:30px">' +
                '<div style="font-size:48px;margin-bottom:16px">🎉</div>' +
                '<div style="font-size:20px;font-weight:700;margin-bottom:8px;color:#22c55e">' + round.name + '融资成功！</div>' +
                '<div style="margin-top:20px;padding:16px;background:rgba(34,197,94,0.1);border-radius:12px">' +
                    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:14px;text-align:left">' +
                        '<div>融资金额</div>' +
                        '<div style="font-weight:700;color:#22c55e;text-align:right">' + Utils.formatMoney(fundingAmount) + '</div>' +
                        '<div>股权稀释</div>' +
                        '<div style="font-weight:700;text-align:right">' + (dilution * 100).toFixed(1) + '%</div>' +
                        '<div>投后估值</div>' +
                        '<div style="font-weight:700;text-align:right">' + Utils.formatMoney(valuation) + '</div>' +
                    '</div>' +
                '</div>' +
            '</div>',
            {
                title: '✅ 融资成功',
                footer: '<button class="btn btn-primary" onclick="document.querySelector(\'.modal-overlay\').remove();GameState.notify();">完成</button>'
            }
        );
    },
    
    // 融资谈判
    negotiateFunding: function(fundingRoundId) {
        const roll = Math.random();
        let result = '';
        
        if (roll < 0.4) {
            result = 'success';
        } else if (roll < 0.7) {
            result = 'bet_triggered';
        } else {
            result = 'rejected';
        }
        
        if (result === 'success') {
            UI.showModal(
                '<div style="text-align:center;padding:30px">' +
                    '<div style="font-size:48px;margin-bottom:16px">🎉</div>' +
                    '<div style="font-size:18px;font-weight:700;margin-bottom:8px;color:#22c55e">谈判成功！</div>' +
                    '<div style="color:#94a3b8;font-size:14px">投资人同意降低稀释比例，但融资额减少20%</div>' +
                '</div>',
                {
                    title: '💬 谈判结果',
                    footer: '<button class="btn btn-primary" onclick="CapitalActions.acceptNegotiatedFunding(\'' + fundingRoundId + '\')">接受</button>'
                }
            );
        } else if (result === 'bet_triggered') {
            UI.showModal(
                '<div style="text-align:center;padding:30px">' +
                    '<div style="font-size:48px;margin-bottom:16px">⚠️</div>' +
                    '<div style="font-size:18px;font-weight:700;margin-bottom:8px">触发对赌协议</div>' +
                    '<div style="color:#94a3b8;font-size:14px">投资方要求签订对赌协议</div>' +
                    '<div style="margin-top:16px;padding:12px;background:rgba(245,158,11,0.1);border-radius:8px;font-size:13px">' +
                        '• 业绩对赌：未达目标赔偿差额×1.5<br>' +
                        '• 上市对赌：未IPO按年化12%回购<br>' +
                        '• 股权调整：未达标额外稀释' +
                    '</div>' +
                '</div>',
                {
                    title: '📋 对赌协议',
                    footer: 
                        '<button class="btn btn-secondary" onclick="document.querySelector(\'.modal-overlay\').remove()">拒绝</button>' +
                        '<button class="btn btn-primary" style="margin-left:10px" onclick="CapitalActions.acceptBetFunding(\'' + fundingRoundId + '\')">接受对赌</button>'
                }
            );
        } else {
            UI.showModal(
                '<div style="text-align:center;padding:30px">' +
                    '<div style="font-size:48px;margin-bottom:16px">😔</div>' +
                    '<div style="font-size:18px;font-weight:700;margin-bottom:8px;color:#ef4444">投资人撤资</div>' +
                    '<div style="color:#94a3b8;font-size:14px">您的议价行为导致投资人不满</div>' +
                '</div>',
                {
                    title: '❌ 谈判失败',
                    footer: '<button class="btn btn-secondary" onclick="document.querySelector(\'.modal-overlay\').remove()">关闭</button>'
                }
            );
        }
    },
    
    // 接受谈判后的融资
    acceptNegotiatedFunding: function(fundingRoundId) {
        const overlay = document.querySelector('.modal-overlay');
        if (overlay) overlay.remove();
        
        this.acceptFullFunding(fundingRoundId);
    },
    
    // 接受对赌融资
    acceptBetFunding: function(fundingRoundId) {
        const overlay = document.querySelector('.modal-overlay');
        if (overlay) overlay.remove();
        
        this.acceptFullFunding(fundingRoundId);
        
        UI.showToast('对赌协议已签订');
    }
};
