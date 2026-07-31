(() => {
    var ws = null;
    var sessionId = null;
    var reconnectTimer = null;
    var currentTopic = null;
    var currentMode = "discussion";
    var currentSpeed = 1.0;
    var typingTimeout = null;
    var contextMsgId = null;
    var contextMsgContent = "";

    var agentColors = ["#6c5ce7","#00b894","#e17055","#0984e3","#d63031","#e84393","#00cec9","#fdcb6e","#a29bfe","#55efc4"];
    var agentColorMap = {};
    var colorIndex = 0;

    function getAgentColor(name) {
        if (!agentColorMap[name]) { agentColorMap[name] = agentColors[colorIndex % agentColors.length]; colorIndex++; }
        return agentColorMap[name];
    }

    function getAgentInitial(name) {
        if (!name) return "?";
        var map = { CTO: "C", Founder: "F", Critic: "R", Researcher: "S", PM: "P", Moderator: "M" };
        return map[name] || name.charAt(0).toUpperCase();
    }

    function $(sel) { return document.querySelector(sel); }
    function $$(sel) { return document.querySelectorAll(sel); }

    var pages = { landing: $("#page-landing"), chat: $("#page-chat"), agents: $("#page-agents"), settings: $("#page-settings") };

    function showPage(name) {
        Object.values(pages).forEach(function(p) { p.style.display = "none"; });
        var pg = pages[name];
        pg.style.display = "";
        if (name === "chat") pg.classList.add("active-layout");
    }

    function toast(msg) {
        var el = $("#toast");
        el.textContent = msg;
        el.classList.remove("hidden");
        clearTimeout(el._t);
        el._t = setTimeout(function() { el.classList.add("hidden"); }, 2500);
    }

    function api(method, path, body) {
        var opts = { method: method, headers: { "Content-Type": "application/json" } };
        if (body) opts.body = JSON.stringify(body);
        return fetch("/api" + path, opts).then(function(res) {
            if (!res.ok) throw new Error("HTTP " + res.status);
            return res.text();
        }).then(function(text) { return text ? JSON.parse(text) : {}; });
    }

    function esc(text) {
        var d = document.createElement("div");
        d.textContent = text;
        return d.innerHTML;
    }

    function timeStr(ts) {
        var d = ts ? new Date(ts) : new Date();
        return d.getHours().toString().padStart(2, "0") + ":" + d.getMinutes().toString().padStart(2, "0");
    }

    function scrollToBottom() { $("#bottom-anchor").scrollIntoView({ behavior: "smooth" }); }

    function setStatus(text, color) {
        $("#header-status-text").textContent = text;
        $("#header-status-dot").style.background = color;
    }

    function showTyping(agent) {
        var ti = $("#typing-indicator");
        ti.querySelector(".typing-text").textContent = agent + " is typing...";
        ti.classList.remove("hidden");
        scrollToBottom();
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(function() { ti.classList.add("hidden"); }, 3000);
    }

    function hideTyping() {
        $("#typing-indicator").classList.add("hidden");
        clearTimeout(typingTimeout);
    }

    function addMessage(agent, content, msgId, msgType) {
        hideTyping();
        var empty = $("#empty-state");
        if (empty) empty.remove();
        if (msgType === "system") { addSystemMessage(content); return; }
        addMessageToDOM(agent, content, null, msgId, null);
        scrollToBottom();
    }

    function addMessageToDOM(agent, content, timestamp, msgId, prevAgent) {
        var isUser = agent === "User";
        var color = isUser ? "var(--accent)" : getAgentColor(agent);
        var initial = getAgentInitial(agent);
        var now = timeStr(timestamp);
        var isGrouped = prevAgent === agent;

        var msg = document.createElement("div");
        msg.className = "message" + (isUser ? " user" : "") + (isGrouped ? " grouped" : "");
        if (msgId) msg.dataset.msgId = msgId;
        if (agent !== "User" && agent !== "System") msg.dataset.agent = agent;

        var actionsHtml = "";
        if (agent !== "User" && agent !== "System") {
            actionsHtml = '<div class="message-actions">' +
                '<button class="msg-action-btn" data-act="copy" title="Copy"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg></button>' +
                '<button class="msg-action-btn" data-act="bookmark" title="Bookmark"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg></button>' +
                '<button class="msg-action-btn" data-act="challenge" title="Challenge"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></button>' +
                '<button class="msg-action-btn" data-act="more" title="More"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg></button>' +
                '</div>';
        }

        msg.innerHTML = '<div class="message-avatar" style="background:' + esc(color) + '">' + esc(initial) + '</div>' +
            '<div class="message-body">' +
            '<div class="message-header">' +
            '<span class="message-name" style="color:' + esc(color) + '">' + esc(agent) + '</span>' +
            '<span class="message-time">' + now + '</span>' +
            '</div>' +
            '<div class="message-bubble">' +
            '<div class="message-content">' + esc(content).replace(/\n/g, "<br>") + '</div>' +
            actionsHtml +
            '</div>' +
            '</div>';

        msg.querySelectorAll(".msg-action-btn").forEach(function(btn) {
            btn.addEventListener("click", function(e) {
                e.stopPropagation();
                var act = btn.dataset.act;
                if (act === "copy") { navigator.clipboard.writeText(content); toast("Copied"); }
                else if (act === "bookmark") { if (msgId) api("PATCH", "/messages/" + msgId + "/bookmark").then(function() { toast("Bookmarked"); }); }
                else if (act === "challenge") {
                    if (msgId && agent !== "User") {
                        send("challenge", { message_id: msgId, content: content, agent_name: agent });
                        toast("Challenging " + agent);
                    }
                } else if (act === "more") {
                    contextMsgId = msgId;
                    contextMsgContent = content;
                    showContextMenu(e, agent);
                }
            });
        });

        msg.addEventListener("contextmenu", function(e) {
            e.preventDefault();
            contextMsgId = msgId;
            contextMsgContent = content;
            showContextMenu(e, agent);
        });

        $("#messages").appendChild(msg);
    }

    function addSystemMessage(text) {
        var empty = $("#empty-state");
        if (empty) empty.remove();
        var el = document.createElement("div");
        el.className = "message system-msg";
        el.innerHTML = '<div class="message-avatar"></div><div class="message-body"><div class="message-header"></div><div class="message-bubble">' + esc(text) + '</div></div>';
        $("#messages").appendChild(el);
        scrollToBottom();
    }

    function addSummaryCard(data) {
        var card = document.createElement("div");
        card.className = "summary-card";
        var html = '<div class="summary-card-title">Debate Summary</div>';
        if (data.consensus) html += '<div class="summary-section"><div class="summary-label">Consensus</div><div class="summary-text">' + esc(data.consensus) + '</div></div>';
        if (data.disagreements) html += '<div class="summary-section"><div class="summary-label">Disagreements</div><div class="summary-text">' + esc(data.disagreements) + '</div></div>';
        if (data.insights) html += '<div class="summary-section"><div class="summary-label">Key Insights</div><div class="summary-text">' + esc(data.insights) + '</div></div>';
        if (data.unanswered) html += '<div class="summary-section"><div class="summary-label">Open Questions</div><div class="summary-text">' + esc(data.unanswered) + '</div></div>';
        card.innerHTML = html;
        $("#messages").appendChild(card);
        scrollToBottom();
    }

    function addDecisionCard(data) {
        var pros = Array.isArray(data.pros) ? data.pros : [];
        var cons = Array.isArray(data.cons) ? data.cons : [];
        var card = document.createElement("div");
        card.className = "decision-card";
        var html = '<div class="decision-title">Final Decision</div>' +
            '<div class="decision-rec">' + esc(data.recommendation) + '</div>' +
            '<div class="decision-meta"><span class="decision-badge">Confidence: ' + Math.round((data.confidence_score || 0.5) * 100) + '%</span></div>';
        if (pros.length) html += '<div class="summary-label">Pros</div><div class="decision-list">' + pros.map(function(p) { return esc(p); }).join("<br>") + '</div>';
        if (cons.length) html += '<div class="summary-label" style="margin-top:8px">Cons</div><div class="decision-list">' + cons.map(function(c) { return esc(c); }).join("<br>") + '</div>';
        card.innerHTML = html;
        $("#messages").appendChild(card);
        scrollToBottom();
    }

    function renderAgentParticipants(agents) {
        $("#chat-subtitle").textContent = agents.length + " agents active";
    }

    function renderSessions(sessions) {
        var list = $("#sessions-list");
        list.innerHTML = "";
        sessions.forEach(function(s) {
            var el = document.createElement("div");
            el.className = "session-item" + (s.id === sessionId ? " active" : "");
            el.innerHTML = '<span class="session-item-dot ' + (s.status === "ended" ? "ended" : "") + '"></span>' +
                '<div class="session-item-info"><div class="session-item-topic">' + esc(s.topic || "Untitled") + '</div>' +
                '<div class="session-item-meta">' + s.total_messages + ' messages</div></div>';
            el.addEventListener("click", function() { loadSessionById(s.id); });
            list.appendChild(el);
        });
    }

    function loadSessions() {
        api("GET", "/sessions").then(renderSessions).catch(function(e) { console.error(e); });
    }

    function loadRecentDebates() {
        api("GET", "/sessions").then(function(sessions) {
            var recent = sessions.filter(function(s) { return s.topic; }).slice(0, 5);
            if (recent.length > 0) {
                $("#recent-section").style.display = "";
                var list = $("#recent-debates");
                list.innerHTML = "";
                recent.forEach(function(s) {
                    var btn = document.createElement("button");
                    btn.className = "recent-item";
                    btn.innerHTML = '<span class="session-item-dot ' + (s.status === "ended" ? "ended" : "") + '"></span>' +
                        '<span class="recent-item-topic">' + esc(s.topic) + '</span>' +
                        '<span class="recent-item-meta">' + s.total_messages + ' msgs</span>';
                    btn.addEventListener("click", function() { showPage("chat"); loadSessionById(s.id); });
                    list.appendChild(btn);
                });
            }
        }).catch(function(e) { console.error(e); });
    }

    function loadSessionById(id) {
        sessionId = id;
        api("GET", "/sessions/" + id).then(function(data) {
            currentTopic = data.topic;
            currentMode = data.debate_mode || "discussion";
            currentSpeed = data.debate_speed || 1.0;
            connectOrReconnect();
            renderExistingMessages(data.messages || []);
            renderAgentParticipants(data.agents || []);
            updateHeader(data.topic, data.status);
            loadSessions();
        }).catch(function(e) { console.error(e); });
    }

    function renderExistingMessages(messages) {
        var container = $("#messages");
        container.innerHTML = "";
        var lastAgent = null;
        messages.forEach(function(msg) {
            if (msg.message_type === "system") {
                addSystemMessage(msg.content);
            } else {
                addMessageToDOM(msg.agent_name, msg.content, msg.timestamp, msg.id, lastAgent);
                lastAgent = msg.agent_name;
            }
        });
        scrollToBottom();
    }

    function updateHeader(topic, status) {
        $("#chat-title").textContent = topic || "GroupChat AI";
        $("#chat-subtitle").textContent = status === "active" ? "AI discussion in progress" : (topic || "Start a topic to begin");
    }

    function connectOrReconnect() {
        if (!sessionId) return;
        if (ws && ws.readyState === WebSocket.OPEN) return;
        connectWS();
    }

    function connectWS() {
        if (ws && ws.readyState === WebSocket.OPEN) return;
        var proto = location.protocol === "https:" ? "wss" : "ws";
        ws = new WebSocket(proto + "://" + location.host + "/ws/" + sessionId);
        setStatus("connecting", "var(--connecting)");
        ws.onopen = function() { setStatus("live", "var(--online)"); updateSendBtn(); };
        ws.onmessage = function(e) { handleWSMessage(JSON.parse(e.data)); };
        ws.onclose = function(e) {
            setStatus("disconnected", "var(--offline)");
            if (e.code !== 1000) { clearTimeout(reconnectTimer); reconnectTimer = setTimeout(connectWS, 3000); }
        };
        ws.onerror = function() { ws.close(); };
    }

    function handleWSMessage(data) {
        if (data.type === "message") {
            showTyping(data.agent);
            setTimeout(function() { addMessage(data.agent, data.content, data.id, data.message_type); }, 300 + Math.random() * 300);
        } else if (data.type === "typing") {
            showTyping(data.agent);
        } else if (data.type === "summary") {
            addSummaryCard(data.data);
        } else if (data.type === "decision") {
            addDecisionCard(data.data);
        } else if (data.type === "session_info" && data.data.agents) {
            renderAgentParticipants(data.data.agents);
        }
    }

    function send(action, extra) {
        if (!ws || ws.readyState !== WebSocket.OPEN) return;
        var payload = Object.assign({ action: action }, extra || {});
        ws.send(JSON.stringify(payload));
    }

    function updateSendBtn() {
        var input = $("#user-input");
        var btn = $("#btn-send-msg");
        btn.disabled = !input.value.trim() || !ws || ws.readyState !== WebSocket.OPEN;
    }

    function showContextMenu(e, agent) {
        var menu = $("#msg-context-menu");
        menu.classList.remove("hidden");
        menu.style.left = Math.min(e.clientX, window.innerWidth - 200) + "px";
        menu.style.top = Math.min(e.clientY, window.innerHeight - 250) + "px";
    }

    function hideContextMenus() {
        $$(".popup").forEach(function(p) { p.classList.add("hidden"); });
    }

    function getLastAgentMsg() {
        var msgs = $$("#messages .message:not(.system-msg):not(.message.user)");
        if (msgs.length === 0) return null;
        var last = msgs[msgs.length - 1];
        return { id: parseInt(last.dataset.msgId), agent: last.dataset.agent };
    }

    function initLanding() {
        $("#btn-new-debate").addEventListener("click", function() { showPage("chat"); loadSessions(); connectOrReconnect(); });
        $$(".example-card").forEach(function(card) {
            card.addEventListener("click", function() {
                showPage("chat");
                startDebate(card.dataset.topic);
            });
        });
        loadRecentDebates();
    }

    function startDebate(topic) {
        currentTopic = topic;
        api("POST", "/sessions").then(function(data) {
            sessionId = data.id;
            connectWS();
            setTimeout(function() {
                send("start", { topic: topic, mode: currentMode, speed: currentSpeed });
                updateHeader(topic, "active");
                addSystemMessage("Debate started: " + topic);
                loadSessions();
            }, 500);
        }).catch(function(e) { toast("Failed to start debate"); });
    }

    function createNewSession() {
        api("POST", "/sessions").then(function(data) {
            sessionId = data.id;
            connectOrReconnect();
            loadSessions();
            var msgs = $("#messages");
            msgs.innerHTML = '<div class="empty-state" id="empty-state">' +
                '<div class="empty-icon"><svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg></div>' +
                '<h2>Ask a question and watch a panel of experts debate it.</h2>' +
                '<div class="empty-suggestions" id="empty-suggestions"></div></div>';
            initEmptySuggestions();
            currentTopic = null;
            updateHeader(null, "idle");
            toast("New debate created");
        }).catch(function(e) { toast("Failed to create session"); });
    }

    function initSpecialActions() {
        $("#btn-special-actions").addEventListener("click", function(e) {
            e.stopPropagation();
            var popup = $("#special-actions-popup");
            var rect = e.currentTarget.getBoundingClientRect();
            popup.classList.toggle("hidden");
            popup.style.left = rect.left + "px";
            popup.style.bottom = (window.innerHeight - rect.top + 8) + "px";
            popup.style.top = "auto";
        });

        $$("#special-actions-popup .popup-item").forEach(function(btn) {
            btn.addEventListener("click", function() {
                var action = btn.dataset.action;
                if (action === "challenge_all" && contextMsgId) {
                    send("challenge_all", { message_id: contextMsgId, content: contextMsgContent });
                    toast("All agents challenging");
                } else if (action === "explain_further") {
                    var last = getLastAgentMsg();
                    if (last) send("explain_further", { message_id: last.id, agent_name: last.agent });
                    toast("Asking for elaboration");
                } else if (action === "what_are_we_missing") {
                    send("what_are_we_missing");
                    toast("Checking for blind spots");
                } else if (action === "reach_conclusion") {
                    send("reach_conclusion");
                    toast("Reaching conclusion");
                }
                hideContextMenus();
            });
        });
    }

    function initExport() {
        $("#btn-export").addEventListener("click", function(e) {
            e.stopPropagation();
            var popup = $("#export-popup");
            popup.classList.toggle("hidden");
            var rect = e.currentTarget.getBoundingClientRect();
            popup.style.right = (window.innerWidth - rect.right) + "px";
            popup.style.top = rect.bottom + 8 + "px";
        });

        $$("#export-popup .popup-item").forEach(function(btn) {
            btn.addEventListener("click", function() {
                if (!sessionId) return;
                var fmt = btn.dataset.format;
                fetch("/api/sessions/" + sessionId + "/export/" + fmt).then(function(res) {
                    return res.blob();
                }).then(function(blob) {
                    var url = URL.createObjectURL(blob);
                    var a = document.createElement("a");
                    a.href = url;
                    a.download = "debate-" + sessionId + "." + (fmt === "json" ? "json" : fmt === "markdown" ? "md" : "txt");
                    a.click();
                    URL.revokeObjectURL(url);
                    toast("Exported as " + fmt);
                }).catch(function() { toast("Export failed"); });
                hideContextMenus();
            });
        });
    }

    function initSearch() {
        $("#btn-search-toggle").addEventListener("click", function() {
            var bar = $("#search-bar");
            bar.style.display = bar.style.display === "none" ? "" : "none";
            if (bar.style.display !== "none") $("#chat-search-input").focus();
        });

        $("#btn-close-search").addEventListener("click", function() {
            $("#search-bar").style.display = "none";
            $("#chat-search-input").value = "";
        });

        $("#chat-search-input").addEventListener("input", function(e) {
            var q = e.target.value.toLowerCase();
            $$(".message").forEach(function(m) {
                var content = m.querySelector(".message-content");
                if (content && q && content.textContent.toLowerCase().includes(q)) {
                    m.style.background = "var(--bg-hover)";
                } else {
                    m.style.background = "";
                }
            });
        });
    }

    function initChatInput() {
        var input = $("#user-input");
        var btn = $("#btn-send-msg");

        input.addEventListener("input", function() {
            input.style.height = "auto";
            input.style.height = Math.min(input.scrollHeight, 120) + "px";
            updateSendBtn();
        });

        input.addEventListener("keydown", function(e) {
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); btn.click(); }
        });

        btn.addEventListener("click", function() {
            var text = input.value.trim();
            if (!text) return;
            if (sessionId) {
                send("ask_group", { question: text });
                addMessage("User", text, null, "normal");
                input.value = "";
                input.style.height = "auto";
                updateSendBtn();
            }
        });
    }

    function initSidebar() {
        $("#btn-open-sidebar").addEventListener("click", function() { $("#sidebar").classList.remove("collapsed"); });
        $("#btn-close-sidebar").addEventListener("click", function() { $("#sidebar").classList.add("collapsed"); });
        $("#btn-new-session").addEventListener("click", function() { createNewSession(); });

        $("#search-input").addEventListener("input", function(e) {
            api("GET", "/sessions?search=" + encodeURIComponent(e.target.value)).then(renderSessions).catch(function() {});
        });

        document.addEventListener("click", function(e) {
            if (window.innerWidth <= 768) {
                var sb = $("#sidebar");
                if (!sb.classList.contains("collapsed") && !sb.contains(e.target) && e.target !== $("#btn-open-sidebar")) {
                    sb.classList.add("collapsed");
                }
            }
            if (!e.target.closest(".popup") && !e.target.closest("#btn-special-actions") && !e.target.closest("#btn-export") && !e.target.closest(".msg-action-btn")) {
                hideContextMenus();
            }
        });
    }

    function initAgentsPage() {
        $("#btn-manage-agents").addEventListener("click", function() { showPage("agents"); loadAgents(); });
        $$(".btn-back").forEach(function(btn) { btn.addEventListener("click", function() { showPage("chat"); }); });

        $("#btn-create-agent").addEventListener("click", function() {
            var name = prompt("Agent name:");
            if (!name) return;
            var role = prompt("Role (e.g. Analyst, Engineer):") || "participant";
            var promptText = prompt("System prompt:", "You are " + name + ". " + role + ".");
            if (!promptText) return;
            if (sessionId) {
                api("POST", "/sessions/" + sessionId + "/agents", {
                    name: name, role: role, system_prompt: promptText,
                    avatar: name.substring(0, 2).toUpperCase(),
                }).then(function() { toast("Agent created"); loadAgents(); });
            }
        });
    }

    function loadAgents() {
        if (!sessionId) { renderDefaultAgents(); return; }
        api("GET", "/sessions/" + sessionId + "/agents").then(renderAgentCards).catch(renderDefaultAgents);
    }

    function renderDefaultAgents() {
        var defaults = [
            { name: "CTO", role: "CTO", avatar: "CTO", expertise: "architecture,scalability", enabled: true },
            { name: "Founder", role: "Founder", avatar: "FN", expertise: "revenue,market fit", enabled: true },
            { name: "Critic", role: "Critic", avatar: "CR", expertise: "weaknesses,assumptions", enabled: true },
            { name: "Researcher", role: "Researcher", avatar: "RS", expertise: "facts,evidence", enabled: true },
            { name: "PM", role: "Product Manager", avatar: "PM", expertise: "users,prioritization", enabled: true },
            { name: "Moderator", role: "Moderator", avatar: "MD", expertise: "summaries,consensus", enabled: true },
        ];
        renderAgentCards(defaults);
    }

    function renderAgentCards(agents) {
        var grid = $("#agents-list");
        grid.innerHTML = "";
        agents.forEach(function(a) {
            var color = getAgentColor(a.name);
            var card = document.createElement("div");
            card.className = "agent-card" + (a.enabled === false ? " disabled" : "");
            card.innerHTML = '<div class="agent-card-header">' +
                '<div class="agent-avatar" style="background:' + esc(color) + '">' + esc(getAgentInitial(a.name)) + '</div>' +
                '<div class="agent-card-info"><div class="agent-card-name">' + esc(a.name) + '</div>' +
                '<div class="agent-card-role">' + esc(a.role || "participant") + '</div></div>' +
                '</div>' +
                '<div class="agent-card-body">' + esc(a.system_prompt || a.expertise || "") + '</div>' +
                '<div class="agent-card-footer">' +
                '<span style="font-size:12px;color:var(--text-muted)">' + (a.enabled !== false ? "Active" : "Disabled") + '</span>' +
                '<label class="toggle-switch"><input type="checkbox" class="agent-toggle" ' + (a.enabled !== false ? "checked" : "") + '><span class="toggle-slider"></span></label>' +
                '</div>';

            card.querySelector(".agent-toggle").addEventListener("change", function(e) {
                if (a.id) {
                    api("PATCH", "/agents/" + a.id + "/toggle").then(function() {
                        toast(a.name + " " + (e.target.checked ? "enabled" : "disabled"));
                    });
                }
            });

            grid.appendChild(card);
        });
    }

    function initSettingsPage() {
        $("#btn-debate-settings").addEventListener("click", function() { showPage("settings"); });

        $$(".mode-btn").forEach(function(btn) {
            btn.addEventListener("click", function() {
                $$(".mode-btn").forEach(function(b) { b.classList.remove("active"); });
                btn.classList.add("active");
                currentMode = btn.dataset.mode;
            });
        });

        var slider = $("#speed-slider");
        slider.addEventListener("input", function() {
            currentSpeed = parseFloat(slider.value);
            $("#speed-value").textContent = currentSpeed.toFixed(1) + "x";
        });

        $("#btn-save-settings").addEventListener("click", function() {
            if (sessionId) {
                api("PATCH", "/sessions/" + sessionId, {
                    debate_mode: currentMode, debate_speed: currentSpeed,
                    max_messages: parseInt($("#max-messages").value) || 200,
                    max_tokens: parseInt($("#max-tokens").value) || 500000,
                }).then(function() { toast("Settings saved"); }).catch(function() { toast("Failed to save"); });
            } else {
                toast("Settings will apply to next debate");
            }
        });
    }

    function initEmptySuggestions() {
        var container = $("#empty-suggestions");
        if (!container) return;
        container.innerHTML = "";
        ["Should I build my startup with Rust?", "Can an indie game survive without marketing?", "Best country for a game studio?"].forEach(function(s) {
            var btn = document.createElement("button");
            btn.className = "empty-suggestion";
            btn.textContent = s;
            btn.addEventListener("click", function() {
                if (sessionId) {
                    send("start", { topic: s, mode: currentMode, speed: currentSpeed });
                    currentTopic = s;
                    updateHeader(s, "active");
                    addSystemMessage("Debate started: " + s);
                } else {
                    startDebate(s);
                }
            });
            container.appendChild(btn);
        });
    }

    function init() {
        initLanding();
        initSidebar();
        initChatInput();
        initSpecialActions();
        initExport();
        initSearch();
        initAgentsPage();
        initSettingsPage();
        initEmptySuggestions();
        showPage("landing");
    }

    init();
})();
