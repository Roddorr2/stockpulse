package com.stockpulse.application.usecase;

import com.stockpulse.application.dto.FiltroVentasDTO;
import com.stockpulse.application.dto.ItemVentaResponseDTO;
import com.stockpulse.application.dto.VentaResponseDTO;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
public class ExportarHistorialVentasCsvUseCase {

    private final ConsultarHistorialVentasUseCase consultarHistorialVentasUseCase;

    public ExportarHistorialVentasCsvUseCase(ConsultarHistorialVentasUseCase consultarHistorialVentasUseCase) {
        this.consultarHistorialVentasUseCase = consultarHistorialVentasUseCase;
    }

    public byte[] ejecutar(FiltroVentasDTO filtro) {
        List<VentaResponseDTO> ventas = consultarHistorialVentasUseCase.ejecutar(filtro);
        
        StringBuilder csv = new StringBuilder();
        // UTF-8 BOM para que Excel reconozca correctamente los acentos
        csv.append('\ufeff');
        csv.append("ID Venta,Fecha,Sucursal ID,Producto ID,SKU,Nombre Producto,Cantidad,Precio Unitario,Subtotal,Total Venta\n");
        
        for (VentaResponseDTO venta : ventas) {
            String idVenta = venta.id().toString();
            String fecha = venta.fecha().toString();
            String idSucursal = venta.sucursalId().toString();
            String totalVenta = venta.total().toString();
            
            for (ItemVentaResponseDTO item : venta.items()) {
                String nombreLimpio = item.nombreProducto() != null ? item.nombreProducto().replace("\"", "\"\"") : "";
                String skuLimpio = item.skuProducto() != null ? item.skuProducto().replace("\"", "\"\"") : "";
                
                csv.append(idVenta).append(",")
                   .append(fecha).append(",")
                   .append(idSucursal).append(",")
                   .append(item.productoId()).append(",")
                   .append("\"").append(skuLimpio).append("\",")
                   .append("\"").append(nombreLimpio).append("\",")
                   .append(item.cantidad()).append(",")
                   .append(item.precioUnitario()).append(",")
                   .append(item.subtotal()).append(",")
                   .append(totalVenta).append("\n");
            }
        }
        
        return csv.toString().getBytes(StandardCharsets.UTF_8);
    }
}
