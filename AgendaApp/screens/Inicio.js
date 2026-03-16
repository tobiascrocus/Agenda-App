import { useEffect, useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useIsFocused } from '@react-navigation/native';
import { obtenerEstadisticas } from '../services/db';

export default function Inicio({ navigation }) {
  const [datosGrafico, setDatosGrafico] = useState({ labels: [], data: [] });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [estadisticasCompletas, setEstadisticasCompletas] = useState([]);
  const [categoriasTop, setCategoriasTop] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      cargarDatos();
    }
  }, [isFocused]);

  const cargarDatos = async () => {
    try {
      setError(null);
      setCargando(true);
      const estadisticas = await obtenerEstadisticas();

      setEstadisticasCompletas(estadisticas);

      const estadisticasOrdenadas = [...estadisticas]
        .sort((a, b) => b.total_tareas - a.total_tareas)
        .slice(0, 5);

      setCategoriasTop(estadisticasOrdenadas);

      const labels = estadisticasOrdenadas.map(e =>
        e.categoria_nombre.length > 10
          ? e.categoria_nombre.substring(0, 8) + '...'
          : e.categoria_nombre
      );

      const data = estadisticasOrdenadas.map(e => e.porcentaje_completado);

      setDatosGrafico({ labels, data });
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
      setError('Error cargando los datos. Reintenta.');
    } finally {
      setCargando(false);
    }
  };

  const screenWidth = Dimensions.get('window').width;

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={null}
    >
      <Text style={styles.titulo}>Agenda de Tareas</Text>
      <View style={styles.links}>
        <Pressable style={styles.boton} onPress={() => navigation.navigate('Tareas')}>
          <Text style={styles.botonTexto}>Tareas</Text>
        </Pressable>
        <Pressable style={styles.boton} onPress={() => navigation.navigate('Categorias')}>
          <Text style={styles.botonTexto}>Categorías</Text>
        </Pressable>
      </View>

      <Text style={styles.subtitulo}>
        {categoriasTop.length > 0
          ? `Top ${categoriasTop.length} categorías con más tareas (%)`
          : 'Tareas completadas por categoría (%)'
        }
      </Text>
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.botonReintentar} onPress={cargarDatos}>
            <Text style={styles.botonTexto}>Reintentar</Text>
          </Pressable>
        </View>
      ) : cargando ? (
        <Text style={styles.cargandoText}>Cargando estadísticas...</Text>
      ) : datosGrafico.labels.length > 0 ? (
        <>
          <BarChart
            data={{
              labels: datosGrafico.labels,
              datasets: [{ data: datosGrafico.data }],
            }}
            width={screenWidth - 40}
            height={220}
            fromZero
            chartConfig={{
              backgroundColor: '#e0f7ff',
              backgroundGradientFrom: '#e0f7ff',
              backgroundGradientTo: '#b3e0ff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 119, 204, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              barPercentage: 0.6,
              propsForLabels: {
                fontSize: 11,
              }
            }}
            style={styles.grafico}
            showBarTops={false}
            withInnerLines={true}
          />
          <View style={styles.infoTopContainer}>
            <Text style={styles.infoTopTitulo}>📈 Top 5 Categorías por Cantidad de Tareas</Text>
            {categoriasTop.map((categoria, index) => (
              <View key={index} style={styles.infoTopItem}>
                <Text style={styles.infoTopPosicion}>{index + 1}.</Text>
                <Text style={styles.infoTopNombre}>{categoria.categoria_nombre}</Text>
                <Text style={styles.infoTopTareas}>{categoria.total_tareas} tareas</Text>
                <Text style={[
                  styles.infoTopPorcentaje,
                  { color: categoria.porcentaje_completado >= 50 ? '#28a745' : '#dc3545' }
                ]}>
                  {categoria.porcentaje_completado}% completado
                </Text>
              </View>
            ))}
          </View>
          {estadisticasCompletas.length > 5 && (
            <View style={styles.tablaContainer}>
              <Text style={styles.tablaTitulo}>
                📋 Todas las categorías ({estadisticasCompletas.length})
              </Text>
              <View style={styles.tabla}>
                {estadisticasCompletas.map((estadistica, index) => (
                  <View key={index} style={styles.filaTabla}>
                    <Text style={styles.celdaNombre} numberOfLines={1}>
                      {estadistica.categoria_nombre}
                    </Text>
                    <Text style={styles.celdaTareas}>
                      {estadistica.total_tareas}
                    </Text>
                    <Text style={styles.celdaPorcentaje}>
                      {estadistica.porcentaje_completado}%
                    </Text>
                    <Text style={styles.celdaDetalle}>
                      ({estadistica.tareas_completadas} completadas)
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </>
      ) : (
        <View style={styles.sinDatosContainer}>
          <Text style={styles.sinDatosText}>No hay datos para mostrar</Text>
          <Text style={styles.sinDatosSubtext}>
            Agrega tareas y categorías para ver estadísticas
          </Text>
          <Pressable style={styles.botonReintentar} onPress={cargarDatos}>
            <Text style={styles.botonTexto}>Actualizar</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 40,
    paddingBottom: 60,
    alignItems: 'center'
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0077cc',
    marginBottom: 20,
    textAlign: 'center'
  },
  links: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30
  },
  boton: {
    backgroundColor: '#0077cc',
    paddingVertical: 14,
    borderRadius: 12,
    width: '90%',
    marginVertical: 8,
    alignItems: 'center',
  },
  botonReintentar: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  botonTexto: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0077cc',
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center'
  },
  grafico: {
    borderRadius: 12,
    marginVertical: 10
  },
  cargandoText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 20
  },
  sinDatosContainer: {
    alignItems: 'center',
    marginVertical: 20
  },
  sinDatosText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 5
  },
  sinDatosSubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 15
  },
  errorContainer: {
    alignItems: 'center',
    marginVertical: 20
  },
  errorText: {
    fontSize: 16,
    color: '#ff6b6b',
    textAlign: 'center',
    marginBottom: 10
  },
  infoTopContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginTop: 15,
    marginBottom: 10,
    width: '100%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoTopTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0077cc',
    marginBottom: 12,
    textAlign: 'center',
  },
  infoTopItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoTopPosicion: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0077cc',
    width: 25,
  },
  infoTopNombre: {
    flex: 2,
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  infoTopTareas: {
    flex: 1,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  infoTopPorcentaje: {
    flex: 1,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  tablaContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginTop: 15,
    marginBottom: 20,
    width: '100%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tablaTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0077cc',
    marginBottom: 12,
    textAlign: 'center',
  },
  tabla: {
    width: '100%',
  },
  filaTabla: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  celdaNombre: {
    flex: 2,
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  celdaTareas: {
    flex: 1,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  celdaPorcentaje: {
    flex: 1,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0077cc',
    textAlign: 'center',
  },
  celdaDetalle: {
    flex: 1,
    fontSize: 10,
    color: '#888',
    textAlign: 'right',
  },
});