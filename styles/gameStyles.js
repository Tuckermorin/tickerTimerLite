// styles/gameStyles.js
import { StyleSheet } from 'react-native';

export const gameStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#8e8e93',
    fontSize: 16,
  },
  progressSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  progressTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  progressSubtitle: {
    fontSize: 14,
    color: '#8e8e93',
    marginBottom: 15,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4facfe',
  },
  marketSection: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  sectionTitle: {
    fontSize: 16,
    color: '#8e8e93',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  marketPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  marketChange: {
    fontSize: 16,
    fontWeight: '600',
  },
  portfolioSection: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  portfolioGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  portfolioCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  portfolioLabel: {
    fontSize: 12,
    color: '#8e8e93',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  portfolioValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4facfe',
  },
  portfolioPosition: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  portfolioDetails: {
    gap: 5,
  },
  portfolioDetail: {
    fontSize: 14,
    color: '#8e8e93',
  },
  actionSection: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    gap: 8,
  },
  buyButton: {
    backgroundColor: '#38ef7d',
  },
  sellButton: {
    backgroundColor: '#ff6b6b',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  controlSection: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 'auto',
  },
  controlButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#4facfe',
    gap: 8,
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    gap: 8,
    minWidth: 100,
  },
  menuButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  completeSection: {
    alignItems: 'center',
    padding: 20,
  },
  completeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#38ef7d',
    marginBottom: 10,
  },
  completeText: {
    fontSize: 16,
    color: '#8e8e93',
  },
});