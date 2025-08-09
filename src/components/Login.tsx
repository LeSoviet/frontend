import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoginRequest } from '../types';
import { Eye, EyeOff, Shield, Activity, ArrowRight, Home } from 'lucide-react';

const schema = yup.object({
  username: yup.string().required('El nombre de usuario es requerido'),
  password: yup.string().required('La contraseña es requerida'),
});

const Login: React.FC = () => {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      await login(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-overlay"></div>
      </div>
      
      <div className="login-content">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <Shield className="h-12 w-12 text-primary-600" />
            </div>
            <h1 className="login-title">Panel de Administración</h1>
            <p className="login-subtitle">
              Accede al sistema de gestión farmacéutica
            </p>
          </div>

          <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Usuario
              </label>
              <input
                {...register('username')}
                type="text"
                className="form-input"
                placeholder="Ingresa tu usuario"
              />
              {errors.username && (
                <p className="error-text">{errors.username.message}</p>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Contraseña
              </label>
              <div className="password-input-wrapper">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Ingresa tu contraseña"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="error-text">{errors.password.message}</p>
              )}
            </div>

            {error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="login-button"
            >
              {isLoading ? (
                <>
                  <div className="loading-spinner-sm"></div>
                  Iniciando sesión...
                </>
              ) : (
                <>
                  Iniciar Sesión
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </button>
          </form>
          
          <div className="login-footer">
            <Link to="/" className="back-to-home">
              <Home className="h-4 w-4 mr-2" />
              Volver al inicio
            </Link>
          </div>
        </div>
        
        <div className="login-info">
          <div className="info-card">
            <h3>Credenciales de prueba</h3>
            <p><strong>Usuario:</strong> admin</p>
            <p><strong>Contraseña:</strong> admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;