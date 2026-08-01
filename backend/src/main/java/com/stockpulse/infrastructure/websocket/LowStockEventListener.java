package com.stockpulse.infrastructure.websocket;

import com.stockpulse.application.dto.LowStockAlertDTO;
import com.stockpulse.domain.event.LowStockEvent;
import java.time.LocalDateTime;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
public class LowStockEventListener {

    private final SimpMessagingTemplate messagingTemplate;

    public LowStockEventListener(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @Async
    @EventListener
    public void handleLowStockEvent(LowStockEvent event) {
        String mensaje = String.format(
            "¡ALERTA DE STOCK! El producto '%s' (SKU: %s) alcanzó un nivel crítico de %d unidades (mínimo: %d) en la sucursal %s",
            event.nombreProducto(),
            event.skuProducto(),
            event.stockActual(),
            event.stockMinimo(),
            event.nombreSucursal()
        );

        LowStockAlertDTO payload = new LowStockAlertDTO(
            event.productoId(),
            event.skuProducto(),
            event.nombreProducto(),
            event.sucursalId(),
            event.nombreSucursal(),
            event.stockActual(),
            event.stockMinimo(),
            mensaje,
            LocalDateTime.now()
        );

        // Publica al canal específico de la sucursal
        messagingTemplate.convertAndSend(
            "/topic/stock-alerts/" + event.sucursalId(),
            payload
        );

        // Publica al canal global de administradores
        messagingTemplate.convertAndSend(
            "/topic/stock-alerts/global",
            payload
        );
    }

}
