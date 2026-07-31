package com.stockpulse.unit;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;

import com.stockpulse.application.dto.LowStockAlertDTO;
import com.stockpulse.domain.event.LowStockEvent;
import com.stockpulse.infrastructure.websocket.LowStockEventListener;
import java.time.LocalDateTime;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

@ExtendWith(MockitoExtension.class)
class LowStockEventListenerTest {

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @Captor
    private ArgumentCaptor<LowStockAlertDTO> alertCaptor;

    private LowStockEventListener listener;

    @BeforeEach
    void setUp() {
        listener = new LowStockEventListener(messagingTemplate);
    }

    @Test
    @DisplayName("Notifica a los tópicos STOMP de la sucursal y al canal global cuando se recibe un LowStockEvent")
    void handleLowStockEvent_PublicaMensajesEnTopicosStomp() {
        // Arrange
        UUID productoId = UUID.randomUUID();
        UUID sucursalId = UUID.randomUUID();

        LowStockEvent event = new LowStockEvent(
            productoId,
            "SKU-MACBOOK",
            "MacBook Pro 16",
            sucursalId,
            2,
            5,
            LocalDateTime.now()
        );

        // Act
        listener.handleLowStockEvent(event);

        // Assert
        verify(messagingTemplate).convertAndSend(
            eq("/topic/stock-alerts/" + sucursalId),
            alertCaptor.capture()
        );

        verify(messagingTemplate).convertAndSend(
            eq("/topic/stock-alerts/global"),
            alertCaptor.capture()
        );
    }

}
