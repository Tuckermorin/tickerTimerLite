// styles/resultsStyles.js
import { StyleSheet } from 'react-native';

export const resultsStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#8e8e93',
    textAlign: 'center',
    lineHeight: 22,
  },
  resultsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  resultCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  resultLabel: {
    fontSize: 16,
    color: '#8e8e93',
    fontWeight: '600',
  },
  resultValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  resultReturn: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 3,
  },
  resultDetail: {
    fontSize: 12,
    color: '#8e8e93',
  },
  differenceCard: {
    borderRadius: 12,
    padding: 20,
    marginTop: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  differenceLabel: {
    fontSize: 14,
    color: '#8e8e93',
    marginBottom: 5,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  differenceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  differencePercent: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsSection: {
    marginBottom: 30,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4facfe',
    marginBottom: 3,
  },
  statLabel: {
    fontSize: 12,
    color: '#8e8e93',
  },
  factSection: {
    backgroundColor: 'rgba(255, 206, 84, 0.1)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 206, 84, 0.3)',
  },
  factTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffce54',
    marginBottom: 10,
  },
  factText: {
    fontSize: 14,
    color: '#8e8e93',
    lineHeight: 20,
  },
  actionSection: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 'auto',
  },
  playAgainButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  playAgainGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    gap: 8,
  },
  playAgainText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    gap: 8,
    minWidth: 100,
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});