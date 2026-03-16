import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useState, useEffect } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import {
  obtenerTareas,
  agregarTarea,
  actualizarTarea,
  eliminarTarea,
  toggleTareaRealizada,
  obtenerCategorias
} from '../services/db';

export default function Tareas() {
  const [tareas, setTareas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [nuevaTarea, setNuevaTarea] = useState({
    nombre: '',
    descripcion: '',
    categoria_id: null,
    fecha: '',
    hora: '',
    realizada: false
  });
  const [modoEdicion, setModoEdicion] = useState(null);
  const [tareaEditada, setTareaEditada] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePickerEdit, setShowDatePickerEdit] = useState(false);
  const [showTimePickerEdit, setShowTimePickerEdit] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [tareasData, categoriasData] = await Promise.all([
        obtenerTareas(),
        obtenerCategorias()
      ]);
      setTareas(tareasData);
      setCategorias(categoriasData);
    } catch (error) {
      console.error('Error cargando datos:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos');
    } finally {
      setCargando(false);
    }
  };

  const agregarTareaHandler = async () => {
    if (!nuevaTarea.nombre.trim() || !nuevaTarea.categoria_id) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios (Nombre y Categoría).');
      return;
    }
    try {
      await agregarTarea(nuevaTarea);
      setNuevaTarea({
        nombre: '',
        descripcion: '',
        categoria_id: null,
        fecha: '',
        hora: '',
        realizada: false
      });
      setMostrarFormulario(false);
      await cargarDatos();
      Alert.alert('Éxito', 'Tarea agregada correctamente');
    } catch (error) {
      console.error('Error agregando tarea:', error);
      Alert.alert('Error', 'No se pudo agregar la tarea');
    }
  };

  const cancelarAgregar = () => {
    setMostrarFormulario(false);
    setNuevaTarea({
      nombre: '',
      descripcion: '',
      categoria_id: null,
      fecha: '',
      hora: '',
      realizada: false
    });
  };

  const guardarEdicion = async () => {
    if (!tareaEditada.nombre.trim() || !tareaEditada.categoria_id) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios (Nombre y Categoría).');
      return;
    }

    try {
      await actualizarTarea(modoEdicion, tareaEditada);
      setModoEdicion(null);
      setTareaEditada({});
      await cargarDatos();
      Alert.alert('Éxito', 'Tarea actualizada correctamente');
    } catch (error) {
      console.error('Error actualizando tarea:', error);
      Alert.alert('Error', 'No se pudo actualizar la tarea');
    }
  };

  const cancelarEdicion = () => {
    setModoEdicion(null);
    setTareaEditada({});
    setShowDatePickerEdit(false);
    setShowTimePickerEdit(false);
  };

  const eliminarTareaHandler = async (id) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que quieres eliminar esta tarea?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await eliminarTarea(id);
              await cargarDatos();
              Alert.alert('Éxito', 'Tarea eliminada correctamente');
            } catch (error) {
              console.error('Error eliminando tarea:', error);
              Alert.alert('Error', 'No se pudo eliminar la tarea');
            }
          }
        },
      ]
    );
  };

  const alternarRealizadaHandler = async (id, realizadaActual) => {
    try {
      await toggleTareaRealizada(id, !realizadaActual);
      await cargarDatos();
    } catch (error) {
      console.error('Error actualizando tarea:', error);
      Alert.alert('Error', 'No se pudo actualizar el estado de la tarea');
    }
  };

  const tareasOrdenadas = [...tareas].sort((a, b) => {
    const dateA = new Date(`${a.fecha ?? ''} ${a.hora ?? ''}`);
    const dateB = new Date(`${b.fecha ?? ''} ${b.hora ?? ''}`);
    return dateA - dateB;
  });

  const renderPicker = (selectedValue, onValueChange, items, placeholder) => (
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={styles.picker}
        dropdownIconColor="#0077cc"
      >
        <Picker.Item label={placeholder} value={null} style={styles.pickerItem} />
        {items.map(item => (
          <Picker.Item key={item.id} label={item.nombre ?? ''} value={item.id} style={styles.pickerItem} />
        ))}
      </Picker>
    </View>
  );

  const renderItem = ({ item }) => {
    const categoria = categorias.find(c => c.id === item.categoria_id)?.nombre ?? '-';
    const esEdicion = modoEdicion === item.id;

    if (esEdicion) {
      return (
        <View style={styles.itemEdicion}>
          <TextInput
            style={styles.inputEditar}
            placeholder="Nombre"
            value={tareaEditada.nombre ?? ''}
            onChangeText={(text) => setTareaEditada({ ...tareaEditada, nombre: text })}
          />
          <TextInput
            style={styles.inputEditar}
            placeholder="Descripción"
            value={tareaEditada.descripcion ?? ''}
            onChangeText={(text) => setTareaEditada({ ...tareaEditada, descripcion: text })}
          />
          {renderPicker(
            tareaEditada.categoria_id,
            (itemValue) => setTareaEditada({ ...tareaEditada, categoria_id: itemValue }),
            categorias,
            "Seleccionar categoría"
          )}
          <Pressable style={styles.btnPicker} onPress={() => setShowDatePickerEdit(true)}>
            <Text style={styles.btnTexto}>{tareaEditada.fecha ? tareaEditada.fecha : 'Seleccionar fecha'}</Text>
          </Pressable>
          <Pressable style={styles.btnPicker} onPress={() => setShowTimePickerEdit(true)}>
            <Text style={styles.btnTexto}>{tareaEditada.hora ? tareaEditada.hora : 'Seleccionar hora'}</Text>
          </Pressable>
          {showDatePickerEdit && (
            <DateTimePicker
              value={tareaEditada.fecha ? new Date(tareaEditada.fecha) : new Date()}
              mode="date"
              display="default"
              onChange={(e, date) => {
                setShowDatePickerEdit(false);
                if (date) {
                  const formattedDate = date.toLocaleDateString('es-ES');
                  setTareaEditada({ ...tareaEditada, fecha: formattedDate });
                }
              }}
            />
          )}
          {showTimePickerEdit && (
            <DateTimePicker
              value={tareaEditada.hora ? new Date(`1970-01-01T${tareaEditada.hora}`) : new Date()}
              mode="time"
              display="default"
              onChange={(e, time) => {
                setShowTimePickerEdit(false);
                if (time) {
                  const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  setTareaEditada({ ...tareaEditada, hora: formattedTime });
                }
              }}
            />
          )}
          <View style={styles.botonesFila}>
            <Pressable style={styles.btnGuardarAgregar} onPress={guardarEdicion}>
              <Text style={styles.btnTexto}>Guardar</Text>
            </Pressable>
            <Pressable style={[styles.btnGuardarAgregar, { backgroundColor: '#cc0000' }]} onPress={cancelarEdicion}>
              <Text style={styles.btnTexto}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.item}>
        <View style={{ flex: 1 }}>
          <Text style={styles.tituloTarea}>{item.nombre ?? ''}</Text>
          <Text style={styles.texto}>{item.descripcion ?? ''}</Text>
          <Text style={styles.categoria}>Categoría: {categoria}</Text>
          <Text style={styles.fecha}>{(item.fecha ?? '') + ' - ' + (item.hora ?? '')}</Text>
        </View>
        <View style={styles.botonesVertical}>
          <Pressable
            style={[styles.boton, styles.botonEditar]}
            onPress={() => {
              setMostrarFormulario(false);
              setModoEdicion(item.id);
              setTareaEditada(item);
            }}
          >
            <Text style={styles.btnTexto}>Editar</Text>
          </Pressable>
          <Pressable style={[styles.boton, styles.botonEliminar]} onPress={() => eliminarTareaHandler(item.id)}>
            <Text style={styles.btnTexto}>Eliminar</Text>
          </Pressable>
        </View>
        <View style={{ alignItems: 'center', marginLeft: 10 }}>
          {item.realizada === true && <Text style={styles.hecho}>Hecho</Text>}
          <Pressable onPress={() => alternarRealizadaHandler(item.id, item.realizada)}>
            {item.realizada ? (
              <MaterialIcons name="check-box" size={56} color="green" />
            ) : (
              <MaterialIcons name="check-box-outline-blank" size={56} color="#ccc" />
            )}
          </Pressable>
        </View>
      </View>
    );
  };

  if (cargando) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Cargando tareas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Mis Tareas</Text>
      {!mostrarFormulario && modoEdicion === null && (
        <Pressable style={styles.btnMostrarFormulario} onPress={() => setMostrarFormulario(true)}>
          <Text style={styles.btnTexto}>Agregar Tarea</Text>
        </Pressable>
      )}
      {mostrarFormulario && (
        <View style={styles.formAgregar}>
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={nuevaTarea.nombre ?? ''}
            onChangeText={(text) => setNuevaTarea({ ...nuevaTarea, nombre: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Descripción"
            value={nuevaTarea.descripcion ?? ''}
            onChangeText={(text) => setNuevaTarea({ ...nuevaTarea, descripcion: text })}
          />
          {renderPicker(
            nuevaTarea.categoria_id,
            (itemValue) => setNuevaTarea({ ...nuevaTarea, categoria_id: itemValue }),
            categorias,
            "Seleccionar categoría"
          )}
          <Pressable style={styles.btnPicker} onPress={() => setShowDatePicker(true)}>
            <Text style={styles.btnTexto}>{nuevaTarea.fecha ? nuevaTarea.fecha : 'Seleccionar fecha'}</Text>
          </Pressable>
          <Pressable style={styles.btnPicker} onPress={() => setShowTimePicker(true)}>
            <Text style={styles.btnTexto}>{nuevaTarea.hora ? nuevaTarea.hora : 'Seleccionar hora'}</Text>
          </Pressable>
          {showDatePicker && (
            <DateTimePicker
              value={nuevaTarea.fecha ? new Date(nuevaTarea.fecha) : new Date()}
              mode="date"
              display="default"
              onChange={(e, date) => {
                setShowDatePicker(false);
                if (date) {
                  const formattedDate = date.toLocaleDateString('es-ES');
                  setNuevaTarea({ ...nuevaTarea, fecha: formattedDate });
                }
              }}
            />
          )}
          {showTimePicker && (
            <DateTimePicker
              value={nuevaTarea.hora ? new Date(`1970-01-01T${nuevaTarea.hora}`) : new Date()}
              mode="time"
              display="default"
              onChange={(e, time) => {
                setShowTimePicker(false);
                if (time) {
                  const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  setNuevaTarea({ ...nuevaTarea, hora: formattedTime });
                }
              }}
            />
          )}
          <View style={styles.botonesFila}>
            <Pressable style={styles.btnGuardarAgregar} onPress={agregarTareaHandler}>
              <Text style={styles.btnTexto}>Agregar Tarea</Text>
            </Pressable>
            <Pressable style={[styles.btnGuardarAgregar, { backgroundColor: '#cc0000' }]} onPress={cancelarAgregar}>
              <Text style={styles.btnTexto}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      )}
      <View style={styles.listaContainer}>
        {tareasOrdenadas.length === 0 ? (
          <View style={styles.textoVacioContainer}>
            <Text style={styles.textoVacio}>No hay tareas aún.</Text>
          </View>
        ) : (
          <FlatList
            data={tareasOrdenadas}
            keyExtractor={(item, index) => (item.id ?? index).toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 80 }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 40 },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#0077cc', textAlign: 'center' },
  formAgregar: { marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 10, marginBottom: 10, backgroundColor: '#fff' },
  pickerContainer: { borderWidth: 2, borderColor: '#0077cc', borderRadius: 10, marginBottom: 10, overflow: 'hidden', backgroundColor: '#fff' },
  picker: { color: '#000', height: 50 },
  pickerItem: { fontSize: 16, color: '#000' },
  btnPicker: { borderWidth: 1, borderColor: '#0077cc', borderRadius: 10, padding: 12, marginBottom: 10, alignItems: 'center', backgroundColor: '#0077cc' },
  btnTexto: { color: '#fff', fontWeight: 'bold' },
  btnGuardarAgregar: { backgroundColor: '#ffa500', borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 10, flex: 1, marginHorizontal: 5 },
  btnMostrarFormulario: { backgroundColor: '#ffa500', borderRadius: 10, padding: 14, alignItems: 'center', marginBottom: 10 },
  botonesFila: { flexDirection: 'row', justifyContent: 'space-between' },
  listaContainer: { backgroundColor: '#e6f2ff', borderRadius: 12, padding: 10, marginTop: 10, maxHeight: 630 },
  textoVacioContainer: { alignItems: 'center', marginVertical: 10 },
  item: { flexDirection: 'row', backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 12, alignItems: 'center' },
  itemEdicion: { backgroundColor: '#f0f8ff', padding: 12, borderRadius: 10, marginBottom: 12 },
  tituloTarea: { fontSize: 18, fontWeight: 'bold' },
  texto: { fontSize: 16 },
  categoria: { fontSize: 14, fontStyle: 'italic' },
  fecha: { fontSize: 14, color: '#555' },
  botonesVertical: { flexDirection: 'column', marginLeft: 10 },
  boton: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, marginBottom: 6, alignItems: 'center' },
  botonEditar: { backgroundColor: '#28a745' },
  botonEliminar: { backgroundColor: '#cc0000' },
  hecho: { fontSize: 12, color: 'green', marginBottom: 4 },
  inputEditar: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 10, marginBottom: 6, backgroundColor: '#fff' },
  textoVacio: { textAlign: 'center', color: '#555' }
});