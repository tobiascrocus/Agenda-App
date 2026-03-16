import { useState, useEffect } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { obtenerCategorias, agregarCategoria, actualizarCategoria, eliminarCategoria } from '../services/db';

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [nuevaCat, setNuevaCat] = useState('');
  const [modoEdicion, setModoEdicion] = useState(null);
  const [nombreEditado, setNombreEditado] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      const categoriasData = await obtenerCategorias();
      setCategorias(categoriasData);
    } catch (error) {
      console.error('Error cargando categorías:', error);
      Alert.alert('Error', 'No se pudieron cargar las categorías');
    } finally {
      setCargando(false);
    }
  };

  const agregarCategoriaHandler = async () => {
    if (!nuevaCat.trim()) {
      Alert.alert('Error', 'Debe ingresar un nombre de categoría.');
      return;
    }

    try {
      await agregarCategoria(nuevaCat);
      setNuevaCat('');
      await cargarCategorias();
      Alert.alert('Éxito', 'Categoría agregada correctamente');
    } catch (error) {
      console.error('Error agregando categoría:', error);
      Alert.alert('Error', 'No se pudo agregar la categoría');
    }
  };

  const eliminarCategoriaHandler = async (id) => {
    Alert.alert('Confirmar', '¿Desea eliminar esta categoría?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await eliminarCategoria(id);
            await cargarCategorias();
            Alert.alert('Éxito', 'Categoría eliminada correctamente');
          } catch (error) {
            console.error('Error eliminando categoría:', error);
            Alert.alert('Error', error.message || 'No se pudo eliminar la categoría');
          }
        }
      },
    ]);
  };

  const guardarEdicion = async (id) => {
    if (!nombreEditado.trim()) {
      Alert.alert('Error', 'El nombre no puede estar vacío.');
      return;
    }

    try {
      await actualizarCategoria(id, nombreEditado);
      setModoEdicion(null);
      setNombreEditado('');
      await cargarCategorias();
      Alert.alert('Éxito', 'Categoría actualizada correctamente');
    } catch (error) {
      console.error('Error actualizando categoría:', error);
      Alert.alert('Error', 'No se pudo actualizar la categoría');
    }
  };

  const renderItem = ({ item }) => {
    const esEdicion = modoEdicion === item.id;
    return (
      <View style={esEdicion ? styles.itemEdicion : styles.item}>
        {esEdicion ? (
          <>
            <TextInput
              style={styles.inputEditar}
              value={nombreEditado}
              onChangeText={setNombreEditado}
              placeholder="Nuevo nombre"
            />
            <View style={styles.botonesFila}>
              <Pressable style={styles.btnGuardarAgregar} onPress={() => guardarEdicion(item.id)}>
                <Text style={styles.btnTexto}>Guardar</Text>
              </Pressable>
              <Pressable
                style={[styles.btnGuardarAgregar, { backgroundColor: '#cc0000' }]}
                onPress={() => setModoEdicion(null)}
              >
                <Text style={styles.btnTexto}>Cancelar</Text>
              </Pressable>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.texto}>{item.nombre}</Text>
            <View style={styles.botones}>
              <Pressable
                style={[styles.boton, styles.botonEditar]}
                onPress={() => {
                  setModoEdicion(item.id);
                  setNombreEditado(item.nombre);
                }}
              >
                <Text style={styles.btnTexto}>Editar</Text>
              </Pressable>
              <Pressable
                style={[styles.boton, styles.botonEliminar]}
                onPress={() => eliminarCategoriaHandler(item.id)}
              >
                <Text style={styles.btnTexto}>Eliminar</Text>
              </Pressable>
            </View>
          </>
        )}
      </View>
    );
  };

  if (cargando) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Cargando categorías...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Categorías</Text>

      <View style={styles.formAgregar}>
        <TextInput
          style={styles.input}
          placeholder="Nueva categoría"
          value={nuevaCat}
          onChangeText={setNuevaCat}
        />
        <Pressable style={styles.btnGuardarAgregar} onPress={agregarCategoriaHandler}>
          <Text style={styles.btnTexto}>Agregar</Text>
        </Pressable>
      </View>

      <FlatList
        data={categorias}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.textoVacio}>No hay categorías</Text>}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 40 },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#0077cc', textAlign: 'center' },
  formAgregar: { flexDirection: 'row', marginBottom: 20 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 10, marginRight: 10, backgroundColor: '#fff' },
  btnGuardarAgregar: { backgroundColor: '#0077cc', borderRadius: 10, padding: 14, alignItems: 'center', flex: 1, marginHorizontal: 5 },
  btnTexto: { color: '#fff', fontWeight: 'bold' },
  item: { backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemEdicion: { backgroundColor: '#f0f8ff', borderRadius: 10, padding: 12, marginBottom: 12 },
  texto: { fontSize: 18, flex: 1, color: '#333' },
  botones: { flexDirection: 'row' },
  botonesFila: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  boton: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, marginLeft: 5, alignItems: 'center' },
  botonEditar: { backgroundColor: '#28a745' },
  botonEliminar: { backgroundColor: '#cc0000' },
  inputEditar: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 10, marginBottom: 6, backgroundColor: '#fff' },
  textoVacio: { textAlign: 'center', color: '#555', marginTop: 20 },
});