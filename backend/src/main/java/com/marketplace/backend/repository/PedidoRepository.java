package com.marketplace.backend.repository;

import com.marketplace.backend.dominio.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Integer> {
    List<Pedido> findByUsuarioIdOrderByFechaPedidoDesc(Integer usuarioId);
    boolean existsByNumeroPedido(String numeroPedido);
}